<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\BaseController;
use App\Services\StoryService;
use Inertia\Inertia;

class EditorStoryController extends BaseController
{
    public function __construct(
        private StoryService $storyService
    ) {}

    public function index()
    {
        $stories = $this->storyService->getStoriesForEditor();
        $totalStories = $this->storyService->getStoryCount();

        return $this->renderPage('editor/stories', [
            'stories' => $stories,
            'totalStories' => $totalStories,
        ]);
    }
}
