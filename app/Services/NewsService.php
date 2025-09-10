<?php

namespace App\Services;

use App\Models\News;
use App\Models\NewsComment;
use App\Models\NewsImageAttachment;
use App\Models\NewsVideoAttachment;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NewsService
{
    public function getAllNews(): Collection
    {
        return News::with(['author'])
            ->withCount(['comments', 'likes'])
            ->latest('created_at')
            ->get()
            ->map(function (News $post) {
                return [
                    'id' => $post->id,
                    'title' => $post->news_title,
                    'content' => $post->news_description,
                    'excerpt' => str(\strip_tags($post->news_description))->limit(140)->toString(),
                    'status' => $post->archived ? 'archived' : 'published',
                    'archived' => $post->archived,
                    'author' => [
                        'name' => $post->author?->name ?? 'Unknown',
                        'email' => $post->author?->email ?? '',
                        'avatar' => null,
                    ],
                    'category' => [
                        'name' => 'General',
                        'color' => '#6b7280',
                    ],
                    'created_at' => $post->created_at?->toISOString(),
                    'updated_at' => $post->updated_at?->toISOString(),
                    'published_at' => null,
                    'views' => 0,
                    'comments_count' => $post->comments_count,
                    'likes_count' => $post->likes_count,
                    'featured_image' => $post->attachment_url,
                ];
            });
    }

    public function getNewsForEditor(): Collection
    {
        return News::with('author')
            ->withCount('comments')
            ->latest('created_at')
            ->get()
            ->map(function (News $post) {
                return [
                    'id' => $post->id,
                    'title' => $post->news_title,
                    'content' => $post->news_description,
                    'excerpt' => str(\strip_tags($post->news_description))->limit(140)->toString(),
                    'status' => 'published',
                    'author' => [
                        'name' => $post->author?->name ?? 'Unknown',
                        'email' => $post->author?->email ?? '',
                    ],
                    'created_at' => $post->created_at?->toISOString(),
                    'updated_at' => $post->updated_at?->toISOString(),
                    'comments_count' => $post->comments_count,
                ];
            });
    }

    public function createNews(Request $request, int $userId): News
    {
        $data = $request->validated();

        $news = News::create([
            'news_title' => $data['news_title'],
            'news_description' => $data['news_description'],
            // Keep legacy columns null/none as we moved to attachments tables
            'attachment_type' => 'none',
            'attachment_url' => null,
            'created_by' => $userId,
        ]);

        // Handle images
        /** @var array<int, \Illuminate\Http\UploadedFile>|null $images */
        $images = $request->file('images');
        $imagesOrder = (array) $request->input('images_order', []);
        if (is_array($images)) {
            foreach ($images as $index => $file) {
                $order = isset($imagesOrder[$index]) ? (int) $imagesOrder[$index] : $index;
                $disk = 'public';
                $path = $file->store('news/images', $disk);
                $url = Storage::disk($disk)->url($path);
                $imageInfo = @getimagesize($file->getRealPath());
                $width = $imageInfo !== false ? ($imageInfo[0] ?? null) : null;
                $height = $imageInfo !== false ? ($imageInfo[1] ?? null) : null;
                NewsImageAttachment::create([
                    'news_id' => $news->id,
                    'disk' => $disk,
                    'path' => $path,
                    'url' => $url,
                    'mime_type' => $file->getMimeType(),
                    'size_bytes' => $file->getSize(),
                    'width' => $width,
                    'height' => $height,
                    'display_order' => $order,
                ]);
            }
        }

        // Handle videos
        $videos = (array) $request->input('videos', []);
        $videosOrder = (array) $request->input('videos_order', []);
        foreach ($videos as $index => $url) {
            if (!is_string($url) || $url === '') {
                continue;
            }
            $videoId = $this->extractYouTubeId($url);
            if (!$videoId) {
                continue;
            }
            $order = isset($videosOrder[$index]) ? (int) $videosOrder[$index] : $index;
            NewsVideoAttachment::create([
                'news_id' => $news->id,
                'provider' => 'youtube',
                'provider_video_id' => $videoId,
                'original_url' => $url,
                'embed_url' => 'https://www.youtube-nocookie.com/embed/' . $videoId . '?rel=0&modestbranding=1',
                'display_order' => $order,
            ]);
        }

        return $news;
    }

    public function updateNews(News $news, Request $request): News
    {
        $data = $request->validated();

        $news->update([
            'news_title' => $data['news_title'],
            'news_description' => $data['news_description'],
        ]);

        // Optional: allow replacing attachments on update if new ones are provided
        $images = $request->file('images');
        $videos = (array) $request->input('videos', []);
        if (is_array($images) || count($videos) > 0) {
            // Clear existing attachments if new ones provided
            $news->imageAttachments()->delete();
            $news->videoAttachments()->delete();

            // Re-add using same logic as create
            $this->createNews($request, $news->created_by)->fresh(); // temporary to reuse logic? No, better duplicate minimal logic below
        }

        // Re-add images
        $imagesOrder = (array) $request->input('images_order', []);
        if (is_array($images)) {
            foreach ($images as $index => $file) {
                $order = isset($imagesOrder[$index]) ? (int) $imagesOrder[$index] : $index;
                $disk = 'public';
                $path = $file->store('news/images', $disk);
                $url = Storage::disk($disk)->url($path);
                $imageInfo = @getimagesize($file->getRealPath());
                $width = $imageInfo !== false ? ($imageInfo[0] ?? null) : null;
                $height = $imageInfo !== false ? ($imageInfo[1] ?? null) : null;
                NewsImageAttachment::create([
                    'news_id' => $news->id,
                    'disk' => $disk,
                    'path' => $path,
                    'url' => $url,
                    'mime_type' => $file->getMimeType(),
                    'size_bytes' => $file->getSize(),
                    'width' => $width,
                    'height' => $height,
                    'display_order' => $order,
                ]);
            }
        }

        // Re-add videos
        $videosOrder = (array) $request->input('videos_order', []);
        foreach ($videos as $index => $url) {
            if (!is_string($url) || $url === '') {
                continue;
            }
            $videoId = $this->extractYouTubeId($url);
            if (!$videoId) {
                continue;
            }
            $order = isset($videosOrder[$index]) ? (int) $videosOrder[$index] : $index;
            NewsVideoAttachment::create([
                'news_id' => $news->id,
                'provider' => 'youtube',
                'provider_video_id' => $videoId,
                'original_url' => $url,
                'embed_url' => 'https://www.youtube-nocookie.com/embed/' . $videoId . '?rel=0&modestbranding=1',
                'display_order' => $order,
            ]);
        }

        return $news->refresh();
    }

    public function deleteNews(News $news): bool
    {
        return $news->delete();
    }

    public function archiveNews(News $news): bool
    {
        return $news->archive();
    }

    public function unarchiveNews(News $news): bool
    {
        return $news->unarchive();
    }

    public function getNewsWithDetails(News $news): array
    {
        $news->load(['author', 'comments.user', 'likes', 'imageAttachments', 'videoAttachments']);

        // Normalize existing stored URLs to a safe embeddable URL
        return [
            'id' => $news->id,
            'title' => $news->news_title,
            'description' => $news->news_description,
            'attachments' => [
                'images' => $news->imageAttachments->map(function (NewsImageAttachment $img) {
                    return [
                        'url' => $img->url,
                        'width' => $img->width,
                        'height' => $img->height,
                        'order' => $img->display_order,
                    ];
                }),
                'videos' => $news->videoAttachments->map(function (NewsVideoAttachment $vid) {
                    return [
                        'embedUrl' => $vid->embed_url,
                        'provider' => $vid->provider,
                        'order' => $vid->display_order,
                    ];
                }),
            ],
            'createdAt' => $news->created_at?->toISOString(),
            'likesCount' => $news->likes()->count(),
            'comments' => $news->comments->map(function (NewsComment $c) {
                return [
                    'id' => $c->id,
                    'text' => $c->comment_text,
                    'author' => [
                        'id' => $c->user?->id,
                        'name' => $c->user?->name ?? 'Unknown',
                    ],
                    'createdAt' => $c->created_at?->toISOString(),
                ];
            }),
        ];
    }

    public function deleteNewsComment(News $news, NewsComment $comment): bool
    {
        if ($comment->news_id !== $news->id) {
            return false;
        }
        return $comment->delete();
    }

    public function getNewsStats(): array
    {
        return [
            'totalPosts' => News::count(),
            'publishedPosts' => News::count(),
            'draftPosts' => 0,
        ];
    }

    private function extractYouTubeId(string $url): ?string
    {
        if ($url === '') {
            return null;
        }

        $patterns = [
            '#youtu\.be/([A-Za-z0-9_-]{11})#',
            '#youtube\.com\/(?:watch\?v=|embed/|v/|shorts/)([A-Za-z0-9_-]{11})#',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        $parts = parse_url($url);
        if (!empty($parts['query'])) {
            parse_str($parts['query'], $q);
            if (!empty($q['v']) && is_string($q['v']) && preg_match('/^[A-Za-z0-9_-]{11}$/', $q['v'])) {
                return $q['v'];
            }
        }

        return null;
    }
}
