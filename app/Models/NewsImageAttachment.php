<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NewsImageAttachment extends Model
{
    protected $fillable = [
        'news_id',
        'disk',
        'path',
        'url',
        'mime_type',
        'size_bytes',
        'width',
        'height',
        'display_order',
    ];

    public function news(): BelongsTo
    {
        return $this->belongsTo(News::class);
    }
}


