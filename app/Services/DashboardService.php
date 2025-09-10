<?php

namespace App\Services;

use App\Models\User;
use App\Models\Story;
use App\Models\News;

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
}
