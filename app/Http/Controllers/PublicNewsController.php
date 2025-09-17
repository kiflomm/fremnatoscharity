<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\NewsComment;
use App\Models\NewsLike;
use App\Services\NewsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicNewsController extends Controller
{
    private NewsService $newsService;

    public function __construct(NewsService $newsService)
    {
        $this->newsService = $newsService;
    }

    public function index(Request $request): Response
    {
        // Get pagination parameters
        $recentPage = (int) $request->query('recent_page', 1);
        $popularPage = (int) $request->query('popular_page', 1);
        $search = trim((string) $request->query('q', ''));

        // Get separate data for recent and popular news
        $recentNews = $this->newsService->getRecentNews($recentPage, 5, $search ?: null);
        $popularNews = $this->newsService->getPopularNews($popularPage, 5, $search ?: null);

        // Get the main news data (first item from recent news for detail view)
        $selectedNewsId = $request->query('selected');
        $selectedNews = null;

        if ($selectedNewsId) {
            $selectedNews = News::query()
                ->notArchived()
                ->withCount(['comments', 'likes'])
                ->with(['comments.user', 'likes', 'imageAttachments', 'videoAttachments'])
                ->find($selectedNewsId);

            if ($selectedNews) {
                $authUserId = $request->user()?->id;
                $isLiked = $authUserId ? $selectedNews->likes->contains('user_id', $authUserId) : false;
                
                $selectedNews = [
                    'id' => $selectedNews->id,
                    'title' => $selectedNews->news_title,
                    'description' => $selectedNews->news_description,
                    'attachments' => $this->formatAttachments($selectedNews),
                    'comments' => $this->formatComments($selectedNews->comments),
                    'commentsCount' => $selectedNews->comments_count,
                    'likesCount' => $selectedNews->likes_count,
                    'isLiked' => $isLiked,
                    'createdAt' => $selectedNews->created_at?->toIso8601String(),
                ];
            }
        }

        return Inertia::render('news/index', [
            'recentNews' => $recentNews,
            'popularNews' => $popularNews,
            'selectedNews' => $selectedNews,
            'filters' => [
                'q' => $search,
                'recent_page' => $recentPage,
                'popular_page' => $popularPage,
                'selected' => $selectedNewsId,
            ],
        ]);
    }

    public function show(Request $request, News $news): Response
    {
        $news->load(['comments.user', 'likes', 'imageAttachments', 'videoAttachments']);

        $authUserId = $request->user()?->id;
        $isLiked = $authUserId ? $news->likes->contains('user_id', $authUserId) : false;

        return Inertia::render('news/show', [
            'news' => [
                'id' => $news->id,
                'title' => $news->news_title,
                'description' => $news->news_description,
                'attachments' => $this->formatAttachments($news),
                'createdAt' => $news->created_at?->toIso8601String(),
                'comments' => $this->formatComments($news->comments),
                'likesCount' => $news->likes->count(),
                'isLiked' => $isLiked,
            ],
        ]);
    }

    public function comment(Request $request, News $news): RedirectResponse
    {
        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        NewsComment::create([
            'news_id' => $news->id,
            'user_id' => $request->user()->id,
            'comment_text' => $validated['comment'],
        ]);

        return back()->with('status', 'Comment added');
    }

    public function toggleLike(Request $request, News $news): RedirectResponse
    {
        $userId = $request->user()->id;

        $existing = NewsLike::query()->where('news_id', $news->id)->where('user_id', $userId)->first();
        if ($existing) {
            $existing->delete();
        } else {
            NewsLike::create([
                'news_id' => $news->id,
                'user_id' => $userId,
                'like_emoji' => null,
            ]);
        }

        return back();
    }

    /**
     * Format attachments for consistent output across methods.
     */
    private function formatAttachments(News $news): array
    {
        return [
            'images' => $news->imageAttachments
                ->sortBy('display_order')
                ->map(fn($img) => [
                    'url' => $img->url,
                    'width' => $img->width,
                    'height' => $img->height,
                    'order' => $img->display_order,
                ])
                ->values(),
            'videos' => $news->videoAttachments
                ->sortBy('display_order')
                ->map(fn($vid) => [
                    'embedUrl' => $vid->embed_url,
                    'provider' => $vid->provider,
                    'order' => $vid->display_order,
                ])
                ->values(),
        ];
    }

    /**
     * Format comments for consistent output across methods.
     */
    private function formatComments($comments): array
    {
        return $comments->map(function ($c) {
            return [
                'id' => $c->id,
                'text' => $c->comment_text,
                'author' => [
                    'id' => $c->user->id,
                    'name' => $c->user->name,
                ],
                'createdAt' => $c->created_at?->toIso8601String(),
            ];
        })->values()->toArray();
    }
}