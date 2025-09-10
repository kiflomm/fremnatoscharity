<?php

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\BaseController;
use App\Services\StoryService;
use App\Http\Requests\Admin\StoreStoryRequest;
use App\Http\Requests\Admin\UpdateStoryRequest;
use App\Models\Story;
use Illuminate\Support\Facades\Auth;

class EditorStoryController extends BaseController
{
    public function __construct(
        private StoryService $storyService
    ) {}

    public function index()
    {
        $stories = $this->storyService->getAllStories();
        $totalStories = $this->storyService->getStoryCount();

        return $this->renderPage('editor/stories', [
            'stories' => $stories,
            'totalStories' => $totalStories,
        ]);
    }

    public function show(Story $story)
    {
        $storyData = $this->storyService->getStoryWithDetails($story);
        return $this->renderPage('admin/story-show', [ 'story' => $storyData ]);
    }

    public function store(StoreStoryRequest $request)
    {
        $this->storyService->createStory($request->validated(), Auth::id(), $request);
        return $this->successResponse('Story created successfully');
    }

    public function update(UpdateStoryRequest $request, Story $story)
    {
        $this->storyService->updateStory($story, $request->validated(), $request);
        return $this->successResponse('Story updated successfully');
    }

    public function destroy(Story $story)
    {
        $this->storyService->deleteStory($story);
        return $this->successResponse('Story deleted successfully');
    }

    public function archive(Story $story)
    {
        $story->update(['archived' => true]);
        return $this->successResponse('Story archived successfully');
    }

    public function unarchive(Story $story)
    {
        $story->update(['archived' => false]);
        return $this->successResponse('Story unarchived successfully');
    }
}
