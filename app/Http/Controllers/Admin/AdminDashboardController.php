<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Services\DashboardService;
use Inertia\Inertia;

class AdminDashboardController extends BaseController
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function index()
    {
        $stats = $this->dashboardService->getAdminStats();
        $recent = $this->dashboardService->getRecentActivity();

        return $this->renderPage('admin/dashboard', [
            'stats' => $stats,
            'recent' => $recent,
        ]);
    }
}
