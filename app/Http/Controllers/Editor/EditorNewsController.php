<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\BaseController;
use App\Services\NewsService;
use Inertia\Inertia;

class EditorNewsController extends BaseController
{
    public function __construct(
        private NewsService $newsService
    ) {}

    public function index()
    {
        $posts = $this->newsService->getNewsForEditor();
        $stats = $this->newsService->getNewsStats();

        return $this->renderPage('editor/news', [
            'posts' => $posts,
            'totalPosts' => $stats['totalPosts'],
        ]);
    }
}
