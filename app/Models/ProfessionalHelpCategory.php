<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProfessionalHelpCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'translations',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'translations' => 'array',
    ];

    /**
     * Scope to get only active categories
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to order by sort_order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderBy('name');
    }

    /**
     * Get the translated name for the given locale
     */
    public function getTranslatedName($locale = 'en')
    {
        if ($locale === 'en') {
            return $this->name;
        }

        $translations = $this->translations ?? [];
        return $translations[$locale] ?? $this->name;
    }

    /**
     * Get all available translations
     */
    public function getTranslations()
    {
        return $this->translations ?? [];
    }
}
