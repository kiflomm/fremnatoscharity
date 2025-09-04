<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Story;
use App\Models\News;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'totalUsers' => User::count(),
            // Keep prop names expected by the frontend, sourced from existing models
            'totalBeneficiaries' => Story::count(),
            'totalNewsPosts' => News::count(),
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
        $stories = Story::with(['author'])
            ->withCount('comments')
            ->latest('created_at')
            ->get()
            ->map(function (Story $story) {
                return [
                    'id' => $story->id,
                    'title' => $story->story_title,
                    'content' => $story->story_description,
                    'beneficiary_name' => $story->beneficiary_name,
                    'beneficiary_photo' => null,
                    'status' => 'published',
                    'author' => [
                        'name' => $story->author?->name ?? 'Unknown',
                        'email' => $story->author?->email ?? '',
                    ],
                    'created_at' => $story->created_at?->toISOString(),
                    'updated_at' => $story->updated_at?->toISOString(),
                    'views' => 0,
                    'comments_count' => $story->comments_count,
                ];
            });

        $stats = [
            'totalStories' => Story::count(),
            'publishedStories' => Story::count(),
            'draftStories' => 0,
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
        $posts = News::with(['author'])
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
                    'featured_image' => $post->attachment_url,
                ];
            });

        $stats = [
            'totalPosts' => News::count(),
            'publishedPosts' => News::count(),
            'draftPosts' => 0,
        ];

        return Inertia::render('admin/news', [
            'posts' => $posts,
            'totalPosts' => $stats['totalPosts'],
            'publishedPosts' => $stats['publishedPosts'],
            'draftPosts' => $stats['draftPosts'],
        ]);
    }


}
