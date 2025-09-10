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
                    'attachments' => [
                        'images' => $n->imageAttachments->map(fn($img) => [
                            'url' => $img->url,
                            'width' => $img->width,
                            'height' => $img->height,
                            'order' => $img->display_order,
                        ]),
                        'videos' => $n->videoAttachments->map(fn($vid) => [
                            'embedUrl' => $vid->embed_url,
                            'provider' => $vid->provider,
                            'order' => $vid->display_order,
                        ]),
                    ],
                    'comments' => $n->comments->map(function ($c) {
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
        $news->load(['comments.user', 'likes']);

        $authUserId = $request->user()?->id;
        $isLiked = $authUserId ? $news->likes->contains('user_id', $authUserId) : false;

        return Inertia::render('news/show', [
            'news' => [
                'id' => $news->id,
                'title' => $news->news_title,
                'description' => $news->news_description,
                'attachments' => [
                    'images' => $news->imageAttachments()->orderBy('display_order')->get()->map(fn($img) => [
                        'url' => $img->url,
                        'width' => $img->width,
                        'height' => $img->height,
                        'order' => $img->display_order,
                    ]),
                    'videos' => $news->videoAttachments()->orderBy('display_order')->get()->map(fn($vid) => [
                        'embedUrl' => $vid->embed_url,
                        'provider' => $vid->provider,
                        'order' => $vid->display_order,
                    ]),
                ],
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

    /**
     * Extract a YouTube video ID from various URL formats.
     */
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


