<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Membership extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'father_name',
        'gender',
        'age',
        'country',
        'region',
        'city',
        'woreda',
        'kebele',
        'profession',
        'education_level',
        'phone_number',
        'help_profession',
        'donation_amount',
        'donation_currency',
        'donation_time',
        'property_type',
        'additional_property',
        'property_donation_time',
    ];

    protected $casts = [
        'help_profession' => 'array',
    ];

    /**
     * Get the user who submitted this membership.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}


