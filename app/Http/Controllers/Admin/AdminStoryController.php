<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreStoryRequest;
use App\Http\Requests\Admin\UpdateStoryRequest;
use App\Models\Story;
use App\Services\StoryService;
use Illuminate\Support\Facades\Auth;

class AdminStoryController extends BaseController
{
    public function __construct(
        private StoryService $storyService
    ) {}

    public function index()
    {
        $stories = $this->storyService->getAllStories();
        $totalStories = $this->storyService->getStoryCount();

        return $this->renderPage('admin/stories', [
            'stories' => $stories,
            'totalStories' => $totalStories,
        ]);
    }

    public function store(StoreStoryRequest $request)
    {
        $this->storyService->createStory($request->validated(), Auth::id());

        return $this->successResponse('Story created successfully', null, 'admin.stories.index');
    }

    public function update(UpdateStoryRequest $request, Story $story)
    {
        $this->storyService->updateStory($story, $request->validated());

        return $this->successResponse('Story updated successfully');
    }

    public function destroy(Story $story)
    {
        $this->storyService->deleteStory($story);

        return $this->successResponse('Story deleted successfully');
    }
}
