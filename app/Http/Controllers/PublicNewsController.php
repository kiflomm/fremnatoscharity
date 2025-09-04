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
        $news = News::query()
            ->withCount(['comments', 'likes'])
            ->latest('created_at')
            ->paginate(10)
            ->through(function (News $n) {
                return [
                    'id' => $n->id,
                    'title' => $n->news_title,
                    'description' => str(\strip_tags($n->news_description))->limit(160)->toString(),
                    'attachmentType' => $n->attachment_type,
                    'attachmentUrl' => $n->attachment_url,
                    'commentsCount' => $n->comments_count,
                    'likesCount' => $n->likes_count,
                    'createdAt' => $n->created_at?->toIso8601String(),
                ];
            });

        return Inertia::render('news/index', [
            'news' => $news,
        ]);
    }

    public function show(Request $request, News $news): Response
    {
        $news->load(['comments.user', 'likes']);

        $authUserId = $request->user()?->id;
        $isLiked = $authUserId ? $news->likes->contains('user_id', $authUserId) : false;

        return Inertia::render('news/show', [
            'news' => [
                'id' => $news->id,
                'title' => $news->news_title,
                'description' => $news->news_description,
                'attachmentType' => $news->attachment_type,
                'attachmentUrl' => $news->attachment_url,
                'createdAt' => $news->created_at?->toIso8601String(),
                'comments' => $news->comments->map(function (NewsComment $c) {
                    return [
                        'id' => $c->id,
                        'text' => $c->comment_text,
                        'author' => [
                            'id' => $c->user->id,
                            'name' => $c->user->name,
                        ],
                        'createdAt' => $c->created_at?->toIso8601String(),
                    ];
                }),
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
}


