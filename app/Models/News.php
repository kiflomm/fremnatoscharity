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
        'archived',
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

    /**
     * Image attachments associated with this news item.
     */
    public function imageAttachments(): HasMany
    {
        return $this->hasMany(NewsImageAttachment::class)->orderBy('display_order');
    }

    /**
     * Video attachments associated with this news item.
     */
    public function videoAttachments(): HasMany
    {
        return $this->hasMany(NewsVideoAttachment::class)->orderBy('display_order');
    }

    /**
     * Archive this news item.
     */
    public function archive(): bool
    {
        return $this->update(['archived' => true]);
    }

    /**
     * Unarchive this news item.
     */
    public function unarchive(): bool
    {
        return $this->update(['archived' => false]);
    }

    /**
     * Check if this news item is archived.
     */
    public function isArchived(): bool
    {
        return $this->archived;
    }

    /**
     * Scope to get only non-archived news.
     */
    public function scopeNotArchived($query)
    {
        return $query->where('archived', false);
    }

    /**
     * Scope to get only archived news.
     */
    public function scopeArchived($query)
    {
        return $query->where('archived', true);
    }
}


