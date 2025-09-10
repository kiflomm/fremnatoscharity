<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the role that belongs to the user.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the news posts authored by the user.
     */
    public function news(): HasMany
    {
        return $this->hasMany(News::class, 'created_by');
    }

    /**
     * Get the beneficiary stories authored by the user.
     */
    public function stories(): HasMany
    {
        return $this->hasMany(Story::class, 'created_by');
    }

    /**
     * Get the comments made by the user.
     */
    // Per-type comment relations can be defined on comment models

    /**
     * Check if user has a specific role.
     */
    public function hasRole(string $role): bool
    {
        return $this->role && $this->role->name === $role;
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }

    /**
     * Check if user is editor.
     */
    public function isEditor(): bool
    {
        return $this->hasRole('editor');
    }

    /**
     * Check if user is guest.
     */
    public function isGuest(): bool
    {
        return $this->hasRole('guest');
    }

    /**
     * Check if user is verified (has verified email).
     */
    public function isVerified(): bool
    {
        return $this->hasVerifiedEmail();
    }

    /**
     * Boot the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Automatically verify admin and editor users when their role is assigned
        static::saving(function ($user) {
            if ($user->isDirty('role_id') && !$user->isDirty('email_verified_at')) {
                $role = Role::find($user->role_id);
                if ($role && in_array($role->name, ['admin', 'editor'])) {
                    $user->email_verified_at = now();
                }
            }
        });

        // Validate that admin and editor users are always verified
        static::saving(function ($user) {
            $role = Role::find($user->role_id);
            if ($role && in_array($role->name, ['admin', 'editor']) && !$user->email_verified_at) {
                throw new \Exception('Admin and editor users must have verified email addresses.');
            }
        });
    }
}
