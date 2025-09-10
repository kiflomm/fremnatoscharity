<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StoryImageAttachment extends Model
{
    protected $fillable = [
        'story_id',
        'disk',
        'path',
        'url',
        'mime_type',
        'size_bytes',
        'width',
        'height',
        'display_order',
    ];

    public function story(): BelongsTo
    {
        return $this->belongsTo(Story::class);
    }
}


