<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\BaseController;
use App\Services\DashboardService;
use Inertia\Inertia;

class EditorDashboardController extends BaseController
{
    public function __construct(
        private DashboardService $dashboardService
    ) {}

    public function index()
    {
        $stats = $this->dashboardService->getEditorStats();

        return $this->renderPage('editor/dashboard', [
            'stats' => $stats,
        ]);
    }
}
