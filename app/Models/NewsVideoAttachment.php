<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsVideoAttachment extends Model
{
    protected $fillable = [
        'news_id',
        'provider',
        'provider_video_id',
        'original_url',
        'embed_url',
        'display_order',
    ];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}


