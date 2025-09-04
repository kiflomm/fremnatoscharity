<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Story extends Model
{
    protected $fillable = [
        'story_title',
        'attachment_type',
        'attachment_url',
        'story_description',
        'beneficiary_name',
        'beneficiary_age_group',
        'beneficiary_gender',
        'created_by',
    ];

    /**
     * Author of the story (user who created it).
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Comments on this story.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(StoryComment::class);
    }

    /**
     * Likes on this story.
     */
    public function likes(): HasMany
    {
        return $this->hasMany(StoryLike::class);
    }
}


