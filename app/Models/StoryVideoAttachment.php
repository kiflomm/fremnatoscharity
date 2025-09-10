<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoryVideoAttachment extends Model
{
    protected $fillable = [
        'story_id',
        'provider',
        'provider_video_id',
        'original_url',
        'embed_url',
        'display_order',
    ];

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }
}


