<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bank extends Model
{
    use HasFactory;

    protected $fillable = [
        'display_name_en',
        'display_name_am', 
        'display_name_ti',
        'logo_url',
        'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    /**
     * Get the bank accounts for this bank.
     */
    public function accounts(): HasMany
    {
        return $this->hasMany(BankAccount::class)->orderBy('sort_order');
    }

    /**
     * Get the display name based on current locale.
     */
    public function getDisplayNameAttribute(): string
    {
        $locale = app()->getLocale();
        
        return match($locale) {
            'am' => $this->display_name_am,
            'tg' => $this->display_name_ti,
            default => $this->display_name_en,
        };
    }

    /**
     * Scope to order banks by sort order.
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order');
    }
}
