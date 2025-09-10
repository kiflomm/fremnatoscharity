<?php

namespace App\Services;

use App\Models\News;
use App\Models\NewsComment;
use Illuminate\Support\Collection;

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

    public function createNews(array $data, int $userId): News
    {
        // Normalize YouTube URLs for video attachments
        if ($data['attachment_type'] === 'video' && !empty($data['attachment_url'])) {
            $videoId = $this->extractYouTubeId($data['attachment_url']);
            if ($videoId) {
                $data['attachment_url'] = 'https://www.youtube-nocookie.com/embed/' . $videoId . '?rel=0&modestbranding=1';
            }
        }

        return News::create([
            'news_title' => $data['news_title'],
            'news_description' => $data['news_description'],
            'attachment_type' => $data['attachment_type'],
            'attachment_url' => $data['attachment_url'] ?? null,
            'created_by' => $userId,
        ]);
    }

    public function updateNews(News $news, array $data): News
    {
        // Normalize YouTube URLs for video attachments
        if ($data['attachment_type'] === 'video' && !empty($data['attachment_url'])) {
            $videoId = $this->extractYouTubeId($data['attachment_url']);
            if ($videoId) {
                $data['attachment_url'] = 'https://www.youtube-nocookie.com/embed/' . $videoId . '?rel=0&modestbranding=1';
            }
        }

        $news->update([
            'news_title' => $data['news_title'],
            'news_description' => $data['news_description'],
            'attachment_type' => $data['attachment_type'],
            'attachment_url' => $data['attachment_url'] ?? null,
        ]);

        return $news;
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
        $news->load(['author', 'comments.user', 'likes']);

        // Normalize existing stored URLs to a safe embeddable URL
        $attachmentUrl = $news->attachment_url;
        if ($news->attachment_type === 'video') {
            $videoId = $this->extractYouTubeId($attachmentUrl ?? '');
            if ($videoId) {
                $attachmentUrl = 'https://www.youtube-nocookie.com/embed/' . $videoId . '?rel=0&modestbranding=1';
            }
        }

        return [
            'id' => $news->id,
            'title' => $news->news_title,
            'description' => $news->news_description,
            'attachmentType' => $news->attachment_type,
            'attachmentUrl' => $attachmentUrl,
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
