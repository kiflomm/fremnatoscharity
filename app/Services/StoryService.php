<?php

namespace App\Services;

use App\Models\Story;
use Illuminate\Support\Collection;

class StoryService
{
    public function getAllStories(): Collection
    {
        return Story::with(['author'])
            ->withCount(['comments', 'likes'])
            ->latest('created_at')
            ->get()
            ->map(function (Story $story) {
                return [
                    'id' => $story->id,
                    'title' => $story->story_title,
                    'content' => $story->story_description,
                    'attachment_type' => $story->attachment_type,
                    'attachment_url' => $story->attachment_url,
                    'beneficiary_name' => $story->beneficiary_name,
                    'beneficiary_age_group' => $story->beneficiary_age_group,
                    'beneficiary_gender' => $story->beneficiary_gender,
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
                    'likes_count' => $story->likes_count,
                ];
            });
    }

    public function getStoriesForEditor(): Collection
    {
        return Story::with('author')
            ->withCount('comments')
            ->latest('created_at')
            ->get()
            ->map(function (Story $story) {
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
    }

    public function createStory(array $data, int $userId): Story
    {
        return Story::create([
            'story_title' => $data['story_title'],
            'story_description' => $data['story_description'],
            'attachment_type' => $data['attachment_type'],
            'attachment_url' => $data['attachment_url'] ?? null,
            'beneficiary_name' => $data['beneficiary_name'] ?? null,
            'beneficiary_age_group' => $data['beneficiary_age_group'],
            'beneficiary_gender' => $data['beneficiary_gender'],
            'created_by' => $userId,
        ]);
    }

    public function updateStory(Story $story, array $data): Story
    {
        $story->update([
            'story_title' => $data['story_title'],
            'story_description' => $data['story_description'],
            'attachment_type' => $data['attachment_type'],
            'attachment_url' => $data['attachment_url'] ?? null,
            'beneficiary_name' => $data['beneficiary_name'] ?? null,
            'beneficiary_age_group' => $data['beneficiary_age_group'],
            'beneficiary_gender' => $data['beneficiary_gender'],
        ]);

        return $story;
    }

    public function deleteStory(Story $story): bool
    {
        return $story->delete();
    }

    public function getStoryCount(): int
    {
        return Story::count();
    }
}
