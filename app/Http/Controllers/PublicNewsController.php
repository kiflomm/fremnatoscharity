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
        $authUserId = $request->user()?->id;
        $selectedNews = $this->newsService->getSelectedNews($selectedNewsId, $authUserId);

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
        $authUserId = $request->user()?->id;
        $newsData = $this->newsService->getNewsForShow($news, $authUserId);

        return Inertia::render('news/show', [
            'news' => $newsData,
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

}