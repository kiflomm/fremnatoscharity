<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by admin middleware
    }

    public function rules(): array
    {
        return [
            'news_title' => ['required', 'string', 'max:255'],
            'news_description' => ['required', 'string'],
            // New multi-attachment inputs
            'images' => ['sometimes', 'array'],
            'images.*' => ['file', 'image', 'mimes:jpg,jpeg,png,webp,avif', 'max:10240'],
            'images_order' => ['sometimes', 'array'],
            'images_order.*' => ['integer', 'min:0'],

            'videos' => ['sometimes', 'array'],
            'videos.*' => ['string', 'url', 'max:2048'],
            'videos_order' => ['sometimes', 'array'],
            'videos_order.*' => ['integer', 'min:0'],

            // Backward compatibility (single attachment fields); will be ignored if arrays provided
            'attachment_type' => ['sometimes', 'in:image,video,none'],
            'attachment_url' => ['nullable', 'url', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'news_title.required' => 'The news title is required.',
            'news_description.required' => 'The news description is required.',
            'attachment_type.required' => 'The attachment type is required.',
            'attachment_type.in' => 'The attachment type must be image, video, or none.',
            'attachment_url.url' => 'The attachment URL must be a valid URL.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $hasImages = is_array($this->file('images')) && count($this->file('images')) > 0;
            $hasVideos = is_array($this->input('videos')) && count($this->input('videos')) > 0;

            if (!$hasImages && !$hasVideos) {
                // Allow news without attachments, so no error here.
            }

            // Validate videos are valid YouTube URLs
            if ($hasVideos) {
                foreach ((array) $this->input('videos', []) as $idx => $url) {
                    if (!is_string($url) || $url === '' || !$this->extractYouTubeId($url)) {
                        $validator->errors()->add("videos.$idx", 'Please provide a valid YouTube link.');
                    }
                }
            }

            // Validate orders length match
            $imagesOrder = (array) $this->input('images_order', []);
            $videosOrder = (array) $this->input('videos_order', []);
            if ($hasImages && count($imagesOrder) !== count($this->file('images'))) {
                $validator->errors()->add('images_order', 'images_order length must match images length.');
            }
            if ($hasVideos && count($videosOrder) !== count((array) $this->input('videos'))) {
                $validator->errors()->add('videos_order', 'videos_order length must match videos length.');
            }
        });
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
}
