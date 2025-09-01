<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Support\Str;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
    ];

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });

        static::updating(function ($category) {
            if ($category->isDirty('name') && empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });
    }

    /**
     * Get the news posts for the category.
     */
    public function newsPosts(): MorphToMany
    {
        return $this->morphedByMany(NewsPost::class, 'post', 'post_categories');
    }

    /**
     * Get the beneficiary stories for the category.
     */
    public function beneficiaryStories(): MorphToMany
    {
        return $this->morphedByMany(BeneficiaryStory::class, 'post', 'post_categories');
    }

    /**
     * Get the route key for the model.
     */
    public function getRouteKeyName()
    {
        return 'slug';
    }
}
