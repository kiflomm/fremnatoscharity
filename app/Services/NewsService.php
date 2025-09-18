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
        return News::with(['author', 'imageAttachments', 'videoAttachments'])
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
                    'attachments' => [
                        'images' => $post->imageAttachments
                            ->sortBy('display_order')
                            ->values()
                            ->map(function (\App\Models\NewsImageAttachment $img) {
                                return [
                                    'id' => $img->id,
                                    'url' => $img->url,
                                    'order' => $img->display_order,
                                ];
                            }),
                        'videos' => $post->videoAttachments
                            ->sortBy('display_order')
                            ->values()
                            ->map(function (\App\Models\NewsVideoAttachment $vid) {
                                return [
                                    'id' => $vid->id,
                                    'embedUrl' => $vid->embed_url,
                                    'provider' => $vid->provider,
                                    'order' => $vid->display_order,
                                ];
                            }),
                    ],
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
                /** @var \Illuminate\Filesystem\FilesystemAdapter $fs */
                $fs = Storage::disk($disk);
                $url = $fs->url($path);
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
                'embed_url' => 'https://www.youtube.com/embed/' . $videoId . '?rel=0&modestbranding=1',
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

        // Images: reorder/remove existing and append new
        /** @var array<int, int>|null $existingImageIds */
        $existingImageIds = $request->input('existing_image_ids', null);
        $existingImagesProvided = (bool) $request->boolean('existing_images_provided', false);
        $existingImagesOrder = (array) $request->input('existing_images_order', []);
        if ($existingImagesProvided) {
            if (is_array($existingImageIds) && count($existingImageIds) > 0) {
                $keepIds = array_map('intval', $existingImageIds);
                $news->imageAttachments()->whereNotIn('id', $keepIds)->delete();
                foreach ($keepIds as $idx => $id) {
                    $order = isset($existingImagesOrder[$idx]) ? (int) $existingImagesOrder[$idx] : $idx;
                    $news->imageAttachments()->where('id', $id)->update(['display_order' => $order]);
                }
            } else {
                // No existing images to keep; delete all
                $news->imageAttachments()->delete();
            }
        }

        /** @var array<int, \Illuminate\Http\UploadedFile>|null $newImages */
        $newImages = $request->file('images');
        $newImagesOrder = (array) $request->input('images_order', []);
        $orderOffset = is_array($existingImageIds) ? count($existingImageIds) : 0;
        if (is_array($newImages)) {
            foreach ($newImages as $index => $file) {
                $order = isset($newImagesOrder[$index]) ? (int) $newImagesOrder[$index] + $orderOffset : ($index + $orderOffset);
                $disk = 'public';
                $path = $file->store('news/images', $disk);
                /** @var \Illuminate\Filesystem\FilesystemAdapter $fs */
                $fs = Storage::disk($disk);
                $url = $fs->url($path);
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

        // Videos: if replacement requested, replace with provided list (can be empty to delete all)
        $replaceVideos = (bool) $request->boolean('replace_videos', $request->has('videos'));
        $videos = (array) $request->input('videos', []);
        if ($replaceVideos) {
            $news->videoAttachments()->delete();
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
                    'embed_url' => 'https://www.youtube.com/embed/' . $videoId . '?rel=0&modestbranding=1',
                    'display_order' => $order,
                ]);
            }
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
                        'id' => $img->id,
                        'url' => $img->url,
                        'width' => $img->width,
                        'height' => $img->height,
                        'order' => $img->display_order,
                    ];
                }),
                'videos' => $news->videoAttachments->map(function (NewsVideoAttachment $vid) {
                    return [
                        'id' => $vid->id,
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

    /**
     * Get recent news with pagination for layout sidebar
     */
    public function getRecentNews(int $page = 1, int $perPage = 5, ?string $search = null): array
    {
        $query = News::query()
            ->notArchived()
            ->withCount(['comments', 'likes'])
            ->with(['imageAttachments', 'videoAttachments'])
            ->latest('created_at');

        // Apply search filter if provided
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('news_title', 'like', "%{$search}%")
                  ->orWhere('news_description', 'like', "%{$search}%");
            });
        }

        $paginatedNews = $query->paginate($perPage, ['*'], 'recent_page', $page);

        return [
            'data' => $paginatedNews->map(function (News $n) {
                return [
                    'id' => $n->id,
                    'title' => $n->news_title,
                    'description' => str(\strip_tags($n->news_description))->limit(160)->toString(),
                    'attachments' => [
                        'images' => $n->imageAttachments
                            ->sortBy('display_order')
                            ->map(fn($img) => [
                                'url' => $img->url,
                                'width' => $img->width,
                                'height' => $img->height,
                                'order' => $img->display_order,
                            ])
                            ->values(),
                        'videos' => $n->videoAttachments
                            ->sortBy('display_order')
                            ->map(fn($vid) => [
                                'embedUrl' => $vid->embed_url,
                                'provider' => $vid->provider,
                                'order' => $vid->display_order,
                            ])
                            ->values(),
                    ],
                    'commentsCount' => $n->comments_count,
                    'likesCount' => $n->likes_count,
                    'createdAt' => $n->created_at?->toIso8601String(),
                ];
            }),
            'pagination' => [
                'current_page' => $paginatedNews->currentPage(),
                'last_page' => $paginatedNews->lastPage(),
                'has_prev' => $paginatedNews->currentPage() > 1,
                'has_next' => $paginatedNews->hasMorePages(),
                'total' => $paginatedNews->total(),
            ],
        ];
    }

    /**
     * Get popular news with pagination for layout sidebar (sorted by engagement)
     */
    public function getPopularNews(int $page = 1, int $perPage = 5, ?string $search = null): array
    {
        $query = News::query()
            ->notArchived()
            ->withCount(['comments', 'likes'])
            ->with(['imageAttachments', 'videoAttachments'])
            ->orderByRaw('(comments_count + likes_count) DESC')
            ->orderByDesc('likes_count')
            ->orderByDesc('comments_count')
            ->orderByDesc('created_at');

        // Apply search filter if provided
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('news_title', 'like', "%{$search}%")
                  ->orWhere('news_description', 'like', "%{$search}%");
            });
        }

        $paginatedNews = $query->paginate($perPage, ['*'], 'popular_page', $page);

        return [
            'data' => $paginatedNews->map(function (News $n) {
                return [
                    'id' => $n->id,
                    'title' => $n->news_title,
                    'description' => str(\strip_tags($n->news_description))->limit(160)->toString(),
                    'attachments' => [
                        'images' => $n->imageAttachments
                            ->sortBy('display_order')
                            ->map(fn($img) => [
                                'url' => $img->url,
                                'width' => $img->width,
                                'height' => $img->height,
                                'order' => $img->display_order,
                            ])
                            ->values(),
                        'videos' => $n->videoAttachments
                            ->sortBy('display_order')
                            ->map(fn($vid) => [
                                'embedUrl' => $vid->embed_url,
                                'provider' => $vid->provider,
                                'order' => $vid->display_order,
                            ])
                            ->values(),
                    ],
                    'commentsCount' => $n->comments_count,
                    'likesCount' => $n->likes_count,
                    'createdAt' => $n->created_at?->toIso8601String(),
                ];
            }),
            'pagination' => [
                'current_page' => $paginatedNews->currentPage(),
                'last_page' => $paginatedNews->lastPage(),
                'has_prev' => $paginatedNews->currentPage() > 1,
                'has_next' => $paginatedNews->hasMorePages(),
                'total' => $paginatedNews->total(),
            ],
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
