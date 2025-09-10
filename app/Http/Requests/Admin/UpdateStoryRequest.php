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
            'attachment_type' => ['required', 'in:image,video,none'],
            'attachment_url' => ['nullable', 'url', 'max:2048'],
            'beneficiary_name' => ['nullable', 'string', 'max:255'],
            'beneficiary_age_group' => ['required', 'in:child,youth,elder'],
            'beneficiary_gender' => ['required', 'in:male,female'],
        ];
    }

    public function messages(): array
    {
        return [
            'story_title.required' => 'The story title is required.',
            'story_description.required' => 'The story description is required.',
            'attachment_type.required' => 'The attachment type is required.',
            'attachment_type.in' => 'The attachment type must be image, video, or none.',
            'attachment_url.url' => 'The attachment URL must be a valid URL.',
            'beneficiary_age_group.required' => 'The beneficiary age group is required.',
            'beneficiary_age_group.in' => 'The beneficiary age group must be child, youth, or elder.',
            'beneficiary_gender.required' => 'The beneficiary gender is required.',
            'beneficiary_gender.in' => 'The beneficiary gender must be male or female.',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if (in_array($this->input('attachment_type'), ['image', 'video']) && empty($this->input('attachment_url'))) {
                $validator->errors()->add('attachment_url', 'Attachment URL is required for images or videos.');
            }
        });
    }
}
