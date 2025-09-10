<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Story extends Model
{
    protected $fillable = [
        'story_title',
        'story_description',
        'category',
        'archived',
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

    /**
     * Image attachments for this story.
     */
    public function imageAttachments(): HasMany
    {
        return $this->hasMany(\App\Models\StoryImageAttachment::class);
    }

    /**
     * Video attachments for this story.
     */
    public function videoAttachments(): HasMany
    {
        return $this->hasMany(\App\Models\StoryVideoAttachment::class);
    }
}


