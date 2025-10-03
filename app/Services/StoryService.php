<?php

namespace App\Services;

use App\Models\Story;
use App\Models\StoryImageAttachment;
use App\Models\StoryVideoAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Collection;

class StoryService
{
    public function getAllStories(): Collection
    {
        return Story::with(['author', 'imageAttachments', 'videoAttachments'])
            ->withCount(['comments', 'likes'])
            ->latest('created_at')
            ->get()
            ->map(function (Story $story) {
                return [
                    'id' => $story->id,
                    'title' => $story->story_title,
                    'content' => $story->story_description,
                    'excerpt' => str(\strip_tags($story->story_description))->limit(140)->toString(),
                    'status' => $story->archived ? 'archived' : 'published',
                    'archived' => (bool) $story->archived,
                    'author' => [
                        'name' => $story->author?->name ?? 'Unknown',
                        'email' => $story->author?->email ?? '',
                    ],
                    'category' => $story->category,
                    'created_at' => $story->created_at?->toISOString(),
                    'updated_at' => $story->updated_at?->toISOString(),
                    'comments_count' => $story->comments_count,
                    'likes_count' => $story->likes_count,
                    'attachments' => [
                        'images' => $story->imageAttachments
                            ->sortBy('display_order')
                            ->values()
                            ->map(function (StoryImageAttachment $img) {
                                return [
                                    'id' => $img->id,
                                    'url' => $img->url,
                                    'order' => $img->display_order,
                                ];
                            }),
                        'videos' => $story->videoAttachments
                            ->sortBy('display_order')
                            ->values()
                            ->map(function (StoryVideoAttachment $vid) {
                                return [
                                    'id' => $vid->id,
                                    'embedUrl' => $vid->embed_url,
                                    'provider' => $vid->provider,
                                    'order' => $vid->display_order,
                                ];
                            }),
                    ],
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

    public function createStory(array $data, int $userId, ?Request $request = null): Story
    {
        $story = Story::create([
            'story_title' => $data['story_title'],
            'story_description' => $data['story_description'],
            'category' => $data['category'],
            'archived' => false,
            'created_by' => $userId,
        ]);

        if ($request) {
            /** @var array<int, \Illuminate\Http\UploadedFile>|null $images */
            $images = $request->file('images');
            $imagesOrder = (array) $request->input('images_order', []);
            if (is_array($images)) {
                foreach ($images as $index => $file) {
                    $order = isset($imagesOrder[$index]) ? (int) $imagesOrder[$index] : $index;
                    $disk = 'public';
                    $path = $file->store('stories/images', $disk);
                    
                    // Copy file to public_html/storage for GoDaddy compatibility
                    $this->copyFileToPublic($file, 'stories/images/' . basename($path));
                    
                    /** @var \Illuminate\Filesystem\FilesystemAdapter $fs */
                    $fs = Storage::disk($disk);
                    $url = $fs->url($path);
                    $imageInfo = @getimagesize($file->getRealPath());
                    $width = $imageInfo !== false ? ($imageInfo[0] ?? null) : null;
                    $height = $imageInfo !== false ? ($imageInfo[1] ?? null) : null;
                    StoryImageAttachment::create([
                        'story_id' => $story->id,
                        'disk' => $disk,
                        'path' => $path,
                        'url' => $url,
                        'mime_type' => $file->getMimeType(),
                        'size_bytes' => $file->getSize(),
                        'width' => $width,
                        'height' => $height,
                        'display_order' => $order,
                    ]);
                }
            }

            $videos = (array) $request->input('videos', []);
            $videosOrder = (array) $request->input('videos_order', []);
            foreach ($videos as $index => $url) {
                if (!is_string($url) || $url === '') {
                    continue;
                }
                $videoId = $this->extractYouTubeId($url);
                if (!$videoId) {
                    continue;
                }
                $order = isset($videosOrder[$index]) ? (int) $videosOrder[$index] : $index;
                StoryVideoAttachment::create([
                    'story_id' => $story->id,
                    'provider' => 'youtube',
                    'provider_video_id' => $videoId,
                    'original_url' => $url,
                    'embed_url' => 'https://www.youtube.com/embed/' . $videoId . '?rel=0&modestbranding=1',
                    'display_order' => $order,
                ]);
            }
        }

        return $story;
    }

    public function updateStory(Story $story, array $data, ?Request $request = null): Story
    {
        $story->update([
            'story_title' => $data['story_title'],
            'story_description' => $data['story_description'],
            'category' => $data['category'],
        ]);

        if ($request) {
            /** @var array<int, int>|null $existingImageIds */
            $existingImageIds = $request->input('existing_image_ids', null);
            $existingImagesProvided = (bool) $request->boolean('existing_images_provided', false);
            $existingImagesOrder = (array) $request->input('existing_images_order', []);
            if ($existingImagesProvided) {
                if (is_array($existingImageIds) && count($existingImageIds) > 0) {
                    $keepIds = array_map('intval', $existingImageIds);
                    $story->imageAttachments()->whereNotIn('id', $keepIds)->delete();
                    foreach ($keepIds as $idx => $id) {
                        $order = isset($existingImagesOrder[$idx]) ? (int) $existingImagesOrder[$idx] : $idx;
                        $story->imageAttachments()->where('id', $id)->update(['display_order' => $order]);
                    }
                } else {
                    $story->imageAttachments()->delete();
                }
            }

            /** @var array<int, \Illuminate\Http\UploadedFile>|null $newImages */
            $newImages = $request->file('images');
            $newImagesOrder = (array) $request->input('images_order', []);
            $orderOffset = is_array($existingImageIds) ? count($existingImageIds) : 0;
            if (is_array($newImages)) {
                foreach ($newImages as $index => $file) {
                    $order = isset($newImagesOrder[$index]) ? (int) $newImagesOrder[$index] + $orderOffset : ($index + $orderOffset);
                    $disk = 'public';
                    $path = $file->store('stories/images', $disk);
                    
                    // Copy file to public_html/storage for GoDaddy compatibility
                    $this->copyFileToPublic($file, 'stories/images/' . basename($path));
                    
                    /** @var \Illuminate\Filesystem\FilesystemAdapter $fs */
                    $fs = Storage::disk($disk);
                    $url = $fs->url($path);
                    $imageInfo = @getimagesize($file->getRealPath());
                    $width = $imageInfo !== false ? ($imageInfo[0] ?? null) : null;
                    $height = $imageInfo !== false ? ($imageInfo[1] ?? null) : null;
                    StoryImageAttachment::create([
                        'story_id' => $story->id,
                        'disk' => $disk,
                        'path' => $path,
                        'url' => $url,
                        'mime_type' => $file->getMimeType(),
                        'size_bytes' => $file->getSize(),
                        'width' => $width,
                        'height' => $height,
                        'display_order' => $order,
                    ]);
                }
            }

            $replaceVideos = (bool) $request->boolean('replace_videos', $request->has('videos'));
            $videos = (array) $request->input('videos', []);
            if ($replaceVideos) {
                $story->videoAttachments()->delete();
                $videosOrder = (array) $request->input('videos_order', []);
                foreach ($videos as $index => $url) {
                    if (!is_string($url) || $url === '') {
                        continue;
                    }
                    $videoId = $this->extractYouTubeId($url);
                    if (!$videoId) {
                        continue;
                    }
                    $order = isset($videosOrder[$index]) ? (int) $videosOrder[$index] : $index;
                    StoryVideoAttachment::create([
                        'story_id' => $story->id,
                        'provider' => 'youtube',
                        'provider_video_id' => $videoId,
                        'original_url' => $url,
                        'embed_url' => 'https://www.youtube.com/embed/' . $videoId . '?rel=0&modestbranding=1',
                        'display_order' => $order,
                    ]);
                }
            }
        }

        return $story;
    }

    private function extractYouTubeId(string $url): ?string
    {
        if ($url === '') {
            return null;
        }

        $patterns = [
            '#youtu\.be/([A-Za-z0-9_-]{11})#',
            '#youtube\.com\/(?:watch\?v=|embed/|v/|shorts/)([A-Za-z0-9_-]{11})#',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        $parts = parse_url($url);
        if (!empty($parts['query'])) {
            parse_str($parts['query'], $q);
            if (!empty($q['v']) && is_string($q['v']) && preg_match('/^[A-Za-z0-9_-]{11}$/', $q['v'])) {
                return $q['v'];
            }
        }

        return null;
    }

    public function deleteStory(Story $story): bool
    {
        return $story->delete();
    }

    public function getStoryCount(): int
    {
        return Story::count();
    }

    public function getStoryWithDetails(Story $story): array
    {
        $story->load(['author', 'comments.user', 'likes', 'imageAttachments', 'videoAttachments']);

        return [
            'id' => $story->id,
            'title' => $story->story_title,
            'description' => $story->story_description,
            'attachments' => [
                'images' => $story->imageAttachments->map(function (StoryImageAttachment $img) {
                    return [
                        'id' => $img->id,
                        'url' => $img->url,
                        'width' => $img->width,
                        'height' => $img->height,
                        'order' => $img->display_order,
                    ];
                }),
                'videos' => $story->videoAttachments->map(function (StoryVideoAttachment $vid) {
                    return [
                        'id' => $vid->id,
                        'embedUrl' => $vid->embed_url,
                        'provider' => $vid->provider,
                        'order' => $vid->display_order,
                    ];
                }),
            ],
            'createdAt' => $story->created_at?->toISOString(),
            'likesCount' => $story->likes()->count(),
            'comments' => $story->comments->map(function (\App\Models\StoryComment $c) {
                return [
                    'id' => $c->id,
                    'text' => $c->comment_text,
                    'author' => [
                        'id' => $c->user?->id,
                        'name' => $c->user?->name ?? 'Unknown',
                    ],
                    'createdAt' => $c->created_at?->toISOString(),
                ];
            }),
        ];
    }

    /**
     * Copy uploaded file to public_html/storage for GoDaddy compatibility
     * Only runs in production environment
     */
    private function copyFileToPublic($file, $path): string
    {
        // Only run in production (GoDaddy hosting)
        if (app()->environment('production')) {
            // Use absolute path to public_html since public_path() points to fremnatos/public
            $publicPath = '/home/sog2hcsbpmox/public_html/storage/' . $path;
            
            $publicDir = dirname($publicPath);
            
            // Create directory if it doesn't exist
            if (!is_dir($publicDir)) {
                mkdir($publicDir, 0755, true);
            }
            
            // Copy file to public storage
            copy($file->getRealPath(), $publicPath);
            
            return $publicPath;
        }
        
        // In development, just return the Laravel public path
        return public_path('storage/' . $path);
    }
}
