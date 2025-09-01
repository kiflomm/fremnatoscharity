<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\BeneficiaryStory;
use App\Models\NewsPost;
use App\Models\Comment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalBeneficiaries' => BeneficiaryStory::count(),
            'totalNewsPosts' => NewsPost::count(),
            'totalComments' => Comment::count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }

    public function users()
    {
        $users = User::with('role')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role?->name ?? 'user',
                    'status' => $user->email_verified_at ? 'active' : 'inactive',
                    'created_at' => $user->created_at->toISOString(),
                    'avatar' => $user->profile_photo_url,
                ];
            });

        $stats = [
            'totalUsers' => User::count(),
            'activeUsers' => User::whereNotNull('email_verified_at')->count(),
            'inactiveUsers' => User::whereNull('email_verified_at')->count(),
        ];

        return Inertia::render('admin/users', [
            'users' => $users,
            'totalUsers' => $stats['totalUsers'],
            'activeUsers' => $stats['activeUsers'],
            'inactiveUsers' => $stats['inactiveUsers'],
        ]);
    }

    public function stories()
    {
        $stories = BeneficiaryStory::with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($story) {
                return [
                    'id' => $story->id,
                    'title' => $story->title,
                    'content' => $story->content,
                    'beneficiary_name' => $story->beneficiary_name,
                    'beneficiary_photo' => $story->beneficiary_photo,
                    'status' => $story->status ?? 'draft',
                    'author' => [
                        'name' => $story->user->name,
                        'email' => $story->user->email,
                    ],
                    'created_at' => $story->created_at->toISOString(),
                    'updated_at' => $story->updated_at->toISOString(),
                    'views' => $story->views ?? 0,
                    'comments_count' => $story->comments()->count(),
                ];
            });

        $stats = [
            'totalStories' => BeneficiaryStory::count(),
            'publishedStories' => BeneficiaryStory::where('status', 'published')->count(),
            'draftStories' => BeneficiaryStory::where('status', 'draft')->count(),
        ];

        return Inertia::render('admin/stories', [
            'stories' => $stories,
            'totalStories' => $stats['totalStories'],
            'publishedStories' => $stats['publishedStories'],
            'draftStories' => $stats['draftStories'],
        ]);
    }

    public function news()
    {
        $posts = NewsPost::with(['user', 'category'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'excerpt' => $post->excerpt,
                    'status' => $post->status ?? 'draft',
                    'author' => [
                        'name' => $post->user->name,
                        'email' => $post->user->email,
                        'avatar' => $post->user->profile_photo_url,
                    ],
                    'category' => [
                        'name' => $post->category->name ?? 'Uncategorized',
                        'color' => $post->category->color ?? '#6b7280',
                    ],
                    'created_at' => $post->created_at->toISOString(),
                    'updated_at' => $post->updated_at->toISOString(),
                    'published_at' => $post->published_at?->toISOString(),
                    'views' => $post->views ?? 0,
                    'comments_count' => $post->comments()->count(),
                    'featured_image' => $post->featured_image,
                ];
            });

        $stats = [
            'totalPosts' => NewsPost::count(),
            'publishedPosts' => NewsPost::where('status', 'published')->count(),
            'draftPosts' => NewsPost::where('status', 'draft')->count(),
        ];

        return Inertia::render('admin/news', [
            'posts' => $posts,
            'totalPosts' => $stats['totalPosts'],
            'publishedPosts' => $stats['publishedPosts'],
            'draftPosts' => $stats['draftPosts'],
        ]);
    }

    public function comments()
    {
        $comments = Comment::with(['user', 'commentable'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'content' => $comment->content,
                    'status' => $comment->status ?? 'pending',
                    'author' => [
                        'name' => $comment->user->name,
                        'email' => $comment->user->email,
                        'avatar' => $comment->user->profile_photo_url,
                    ],
                    'post' => [
                        'title' => $comment->commentable->title ?? 'Unknown',
                        'type' => $comment->commentable_type === 'App\Models\BeneficiaryStory' ? 'story' : 'news',
                        'id' => $comment->commentable_id,
                    ],
                    'created_at' => $comment->created_at->toISOString(),
                    'updated_at' => $comment->updated_at->toISOString(),
                    'likes_count' => $comment->likes_count ?? 0,
                    'flags_count' => $comment->flags_count ?? 0,
                    'is_reply' => $comment->parent_id !== null,
                    'parent_comment' => $comment->parent ? [
                        'id' => $comment->parent->id,
                        'content' => $comment->parent->content,
                        'author' => $comment->parent->user->name,
                    ] : null,
                ];
            });

        $stats = [
            'totalComments' => Comment::count(),
            'pendingComments' => Comment::where('status', 'pending')->count(),
            'flaggedComments' => Comment::where('status', 'flagged')->count(),
        ];

        return Inertia::render('admin/comments', [
            'comments' => $comments,
            'totalComments' => $stats['totalComments'],
            'pendingComments' => $stats['pendingComments'],
            'flaggedComments' => $stats['flaggedComments'],
        ]);
    }
}
