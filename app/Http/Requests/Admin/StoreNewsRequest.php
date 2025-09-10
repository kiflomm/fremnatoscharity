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
            'attachment_type' => ['required', 'in:image,video,none'],
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
            if (in_array($this->input('attachment_type'), ['image', 'video']) && empty($this->input('attachment_url'))) {
                $validator->errors()->add('attachment_url', 'Attachment URL is required for images or videos.');
            }

            if ($this->input('attachment_type') === 'video' && !empty($this->input('attachment_url'))) {
                $videoId = $this->extractYouTubeId($this->input('attachment_url'));
                if (!$videoId) {
                    $validator->errors()->add('attachment_url', 'Please provide a valid YouTube link (watch, share, or embed URL).');
                }
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
