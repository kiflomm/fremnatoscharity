<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class News extends Model
{
    protected $fillable = [
        'news_title',
        'attachment_type',
        'attachment_url',
        'news_description',
        'created_by',
    ];

    /**
     * Author of the news (user who created it).
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Comments on this news item.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(NewsComment::class);
    }

    /**
     * Likes on this news item.
     */
    public function likes(): HasMany
    {
        return $this->hasMany(NewsLike::class);
    }
}


