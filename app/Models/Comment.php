<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Comment extends Model
{
    protected $fillable = [
        'content',
        'commentable_type',
        'commentable_id',
        'user_id',
        'guest_name',
        'guest_email',
        'status',
    ];

    /**
     * Get the user that owns the comment.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the parent commentable model (news post or beneficiary story).
     */
    public function commentable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope a query to only include approved comments.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include pending comments.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include rejected comments.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Check if comment is from a guest user.
     */
    public function isGuestComment(): bool
    {
        return is_null($this->user_id);
    }

    /**
     * Get the commenter's name.
     */
    public function getCommenterNameAttribute(): string
    {
        return $this->user ? $this->user->name : $this->guest_name;
    }

    /**
     * Get the commenter's email.
     */
    public function getCommenterEmailAttribute(): ?string
    {
        return $this->user ? $this->user->email : $this->guest_email;
    }
}
