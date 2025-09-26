<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Authorization handled by admin middleware
    }

    public function rules(): array
    {
        return [
            'story_title' => ['required', 'string', 'max:255'],
            'story_description' => ['required', 'string'],
            'category' => ['required', 'in:elders,children,disabled'],
            'existing_images_provided' => ['sometimes'],
            'existing_image_ids' => ['sometimes', 'array'],
            'existing_images_order' => ['sometimes', 'array'],
            'images' => ['sometimes', 'array'],
            'images.*' => ['file', 'image'],
            'images_order' => ['sometimes', 'array'],
            'replace_videos' => ['sometimes'],
            'videos' => ['sometimes', 'array'],
            'videos.*' => ['string'],
            'videos_order' => ['sometimes', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'story_title.required' => 'The story title is required.',
            'story_description.required' => 'The story description is required.',
            'category.required' => 'The category is required.',
            'category.in' => 'Category must be elders, children, or disabled.',
        ];
    }
    
}
