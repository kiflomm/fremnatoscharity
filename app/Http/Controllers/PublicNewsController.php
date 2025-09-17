<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\NewsComment;
use App\Models\NewsLike;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicNewsController extends Controller
{
    public function index(Request $request): Response
    {
        $query = News::query()
            ->notArchived()
            ->withCount(['comments', 'likes'])
            ->with(['comments.user', 'likes', 'imageAttachments', 'videoAttachments'])
            ->latest('created_at');

        // Filters: q (search), type (attachment_type), from/to (created_at range)
        $search = trim((string) $request->query('q', ''));
        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('news_title', 'like', "%{$search}%")
                  ->orWhere('news_description', 'like', "%{$search}%");
            });
        }

        $type = $request->query('type');
        // Deprecated single attachment_type filter; maintain behavior by mapping to existence of attachments
        if ($type === 'image') {
            $query->whereHas('imageAttachments');
        } elseif ($type === 'video') {
            $query->whereHas('videoAttachments');
        } elseif ($type === 'none') {
            $query->doesntHave('imageAttachments')->doesntHave('videoAttachments');
        }

        $from = $request->query('from');
        if (is_string($from) && $from !== '') {
            $query->whereDate('created_at', '>=', $from);
        }

        $to = $request->query('to');
        if (is_string($to) && $to !== '') {
            $query->whereDate('created_at', '<=', $to);
        }

        $authUserId = $request->user()?->id;
        
        $news = $query
            ->paginate(10)
            ->appends($request->query())
            ->through(function (News $n) use ($authUserId) {
                $isLiked = $authUserId ? $n->likes->contains('user_id', $authUserId) : false;
                
                return [
                    'id' => $n->id,
                    'title' => $n->news_title,
                    'description' => str(\strip_tags($n->news_description))->limit(160)->toString(),
                    'attachments' => $this->formatAttachments($n),
                    'comments' => $this->formatComments($n->comments),
                    'commentsCount' => $n->comments_count,
                    'likesCount' => $n->likes_count,
                    'isLiked' => $isLiked,
                    'createdAt' => $n->created_at?->toIso8601String(),
                ];
            });

        return Inertia::render('news/index', [
            'news' => $news,
            'filters' => [
                'q' => $search,
                'type' => in_array($type, ['image', 'video', 'none'], true) ? $type : null,
                'from' => is_string($from) ? $from : null,
                'to' => is_string($to) ? $to : null,
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