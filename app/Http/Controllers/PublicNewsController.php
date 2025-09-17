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
    public function __construct(
        private NewsService $newsService
    ) {}

    public function index(Request $request): Response
    {
        // Filter: q (search)
        $search = trim((string) $request->query('q', ''));
        $searchTerm = $search !== '' ? $search : null;

        $authUserId = $request->user()?->id;
        
        // Fetch recent news with pagination (5 per page)
        $recentNews = $this->newsService->getRecentNewsForPublic(5, $searchTerm);
        $recentNews->appends($request->query());
        $recentNewsData = $recentNews->through(function (News $news) use ($authUserId) {
            return $this->newsService->formatNewsItemForPublic($news, $authUserId);
        });

        // Fetch popular news with pagination (5 per page)
        $popularNews = $this->newsService->getPopularNewsForPublic(5, $searchTerm);
        $popularNews->appends($request->query());
        $popularNewsData = $popularNews->through(function (News $news) use ($authUserId) {
            return $this->newsService->formatNewsItemForPublic($news, $authUserId);
        });

        // For backward compatibility with mobile view, we'll use recent news as the main news data
        return Inertia::render('news/index', [
            'news' => $recentNewsData, // Used by mobile view
            'recentNews' => $recentNewsData,
            'popularNews' => $popularNewsData,
            'filters' => [
                'q' => $search,
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