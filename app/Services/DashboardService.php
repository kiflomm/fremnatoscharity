<?php

namespace App\Services;

use App\Models\User;
use App\Models\Story;
use App\Models\News;
use App\Models\Membership;

class DashboardService
{
    public function getAdminStats(): array
    {
        return [
            'totalUsers' => User::count(),
            'totalStories' => Story::count(),
            'totalNewsPosts' => News::count(),
        ];
    }

    public function getEditorStats(): array
    {
        return [
            'totalStories' => Story::count(),
            'totalNewsPosts' => News::count(),
        ];
    }

    /**
     * Return a unified recent activity feed for the admin dashboard.
     * Includes recent Stories, News, and Membership registrations.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getRecentActivity(): array
    {
        $items = [];

        foreach (Story::latest()->take(5)->get() as $story) {
            $items[] = [
                'type' => 'story',
                'title' => $story->title,
                'created_at' => $story->created_at->toISOString(),
                'link' => '/admin/stories',
            ];
        }

        foreach (News::latest()->take(5)->get() as $news) {
            $items[] = [
                'type' => 'news',
                'title' => $news->title,
                'created_at' => $news->created_at->toISOString(),
                'link' => '/admin/news',
            ];
        }

        foreach (Membership::latest()->take(5)->get() as $membership) {
            $items[] = [
                'type' => 'membership',
                'title' => $membership->name,
                'created_at' => $membership->created_at->toISOString(),
                'link' => '/admin/memberships',
            ];
        }

        // Sort all items by created_at desc
        usort($items, function ($a, $b) {
            return strcmp($b['created_at'], $a['created_at']);
        });

        return array_slice($items, 0, 10);
    }
}
