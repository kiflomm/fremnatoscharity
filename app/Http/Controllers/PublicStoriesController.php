<?php

namespace App\Http\Controllers;

use App\Models\Story;
use App\Models\StoryComment;
use App\Models\StoryLike;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicStoriesController extends Controller
{
    public function index(Request $request): Response
    {
        $stories = Story::query()
            ->withCount(['comments', 'likes'])
            ->latest('created_at')
            ->paginate(10)
            ->through(function (Story $s) {
                return [
                    'id' => $s->id,
                    'title' => $s->story_title,
                    'description' => str(\strip_tags($s->story_description))->limit(160)->toString(),
                    'attachmentType' => $s->attachment_type,
                    'attachmentUrl' => $s->attachment_url,
                    'beneficiary' => [
                        'name' => $s->beneficiary_name,
                        'ageGroup' => $s->beneficiary_age_group,
                        'gender' => $s->beneficiary_gender,
                    ],
                    'commentsCount' => $s->comments_count,
                    'likesCount' => $s->likes_count,
                    'createdAt' => $s->created_at?->toIso8601String(),
                ];
            });

        return Inertia::render('stories/index', [
            'stories' => $stories,
        ]);
    }

    private function listByCategory(string $category, Request $request): Response
    {
        $authUserId = $request->user()?->id;

        $stories = Story::query()
            ->where('category', $category)
            ->where('archived', false)
            ->with(['imageAttachments', 'videoAttachments', 'comments.user', 'likes'])
            ->withCount(['comments', 'likes'])
            ->latest('created_at')
            ->paginate(10)
            ->through(function (Story $s) use ($authUserId) {
                $isLiked = $authUserId ? $s->likes->contains('user_id', $authUserId) : false;
                return [
                    'id' => $s->id,
                    'title' => $s->story_title,
                    'description' => str(\strip_tags($s->story_description))->limit(160)->toString(),
                    'attachments' => [
                        'images' => $s->imageAttachments->sortBy('display_order')->values()->map(function (\App\Models\StoryImageAttachment $img) {
                            return [
                                'url' => $img->url,
                                'width' => $img->width,
                                'height' => $img->height,
                                'order' => $img->display_order,
                            ];
                        }),
                        'videos' => $s->videoAttachments->sortBy('display_order')->values()->map(function (\App\Models\StoryVideoAttachment $vid) {
                            return [
                                'embedUrl' => $vid->embed_url,
                                'provider' => $vid->provider,
                                'order' => $vid->display_order,
                            ];
                        }),
                    ],
                    'comments' => $s->comments->map(function (StoryComment $c) {
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
                    'commentsCount' => $s->comments_count,
                    'likesCount' => $s->likes_count,
                    'isLiked' => $isLiked,
                    'createdAt' => $s->created_at?->toIso8601String(),
                ];
            });

        return Inertia::render('stories/category', [
            'category' => $category,
            'stories' => $stories,
        ]);
    }

    public function elders(Request $request): Response { return $this->listByCategory('elders', $request); }
    public function childrens(Request $request): Response { return $this->listByCategory('childrens', $request); }
    public function disabled(Request $request): Response { return $this->listByCategory('disabled', $request); }

    public function show(Request $request, Story $story): Response
    {
        $story->load(['comments.user', 'likes']);

        $authUserId = $request->user()?->id;
        $isLiked = $authUserId ? $story->likes->contains('user_id', $authUserId) : false;

        return Inertia::render('stories/show', [
            'story' => [
                'id' => $story->id,
                'title' => $story->story_title,
                'description' => $story->story_description,
                'attachmentType' => $story->attachment_type,
                'attachmentUrl' => $story->attachment_url,
                'beneficiary' => [
                    'name' => $story->beneficiary_name,
                    'ageGroup' => $story->beneficiary_age_group,
                    'gender' => $story->beneficiary_gender,
                ],
                'createdAt' => $story->created_at?->toIso8601String(),
                'comments' => $story->comments->map(function (StoryComment $c) {
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
                'likesCount' => $story->likes->count(),
                'isLiked' => $isLiked,
            ],
        ]);
    }

    public function comment(Request $request, Story $story): RedirectResponse
    {
        $validated = $request->validate([
            'comment' => ['required', 'string', 'max:1000'],
        ]);

        StoryComment::create([
            'story_id' => $story->id,
            'user_id' => $request->user()->id,
            'comment_text' => $validated['comment'],
        ]);

        return back()->with('status', 'Comment added');
    }

    public function toggleLike(Request $request, Story $story): RedirectResponse
    {
        $userId = $request->user()->id;

        $existing = StoryLike::query()->where('story_id', $story->id)->where('user_id', $userId)->first();
        if ($existing) {
            $existing->delete();
        } else {
            StoryLike::create([
                'story_id' => $story->id,
                'user_id' => $userId,
                'like_emoji' => null,
            ]);
        }

        return back();
    }
}


