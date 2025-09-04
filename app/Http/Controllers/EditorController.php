<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\Story;
use Inertia\Inertia;

class EditorController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'totalStories' => Story::count(),
            'totalNewsPosts' => News::count(),
        ];

        return Inertia::render('editor/dashboard', [
            'stats' => $stats,
        ]);
    }

    public function stories()
    {
        $stories = Story::with('author')->withCount('comments')->latest('created_at')->get()->map(function (Story $story) {
            return [
                'id' => $story->id,
                'title' => $story->story_title,
                'content' => $story->story_description,
                'beneficiary_name' => $story->beneficiary_name,
                'status' => 'published',
                'author' => [
                    'name' => $story->author?->name ?? 'Unknown',
                    'email' => $story->author?->email ?? '',
                ],
                'created_at' => $story->created_at?->toISOString(),
                'updated_at' => $story->updated_at?->toISOString(),
                'comments_count' => $story->comments_count,
            ];
        });

        return Inertia::render('editor/stories', [
            'stories' => $stories,
            'totalStories' => Story::count(),
        ]);
    }

    public function news()
    {
        $posts = News::with('author')->withCount('comments')->latest('created_at')->get()->map(function (News $post) {
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

        return Inertia::render('editor/news', [
            'posts' => $posts,
            'totalPosts' => News::count(),
        ]);
    }
}


