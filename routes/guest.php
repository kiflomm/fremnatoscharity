<?php

/**
 * --------------------------------------------------------------------------
 * Guest User Routes
 * --------------------------------------------------------------------------
 * 
 * This file defines routes specifically for authenticated "guest" role users.
 * 
 * - All routes are protected by 'auth' and 'verified' middleware, ensuring only
 *   logged-in and email-verified users can access them.
 * - Controllers are responsible for enforcing that the user is actually a guest.
 * - Route names use the 'guest.' prefix for clarity and route helper usage.
 * 
 * Routes included:
 *   - GET    guests/profile         → Edit guest profile form
 *   - PATCH  guests/profile         → Update guest profile
 *   - DELETE guests/profile         → Delete guest profile
 *   - PUT    guests/password        → Update guest password (rate-limited)
 * 
 * Best Practices:
 *   - Use route names and helpers in the frontend for maintainability.
 *   - Apply rate limiting to sensitive actions (e.g., password updates).
 *   - Keep route logic minimal; delegate checks and logic to controllers.
 */

use App\Http\Controllers\Guests\PasswordController as GuestPasswordController;
use App\Http\Controllers\Guests\ProfileController as GuestProfileController;
use Illuminate\Support\Facades\Route;

// Group routes for authenticated and verified users (guests only, enforced in controllers)
Route::middleware(['auth', 'verified'])->group(function () {
    // Guest profile management routes
    Route::get('guests/profile', [GuestProfileController::class, 'edit'])
        ->name('guest.profile.edit');      // Show edit profile form

    Route::patch('guests/profile', [GuestProfileController::class, 'update'])
        ->name('guest.profile.update');    // Update profile details

    Route::delete('guests/profile', [GuestProfileController::class, 'destroy'])
        ->name('guest.profile.destroy');   // Delete guest profile

    // Guest password update route (rate-limited to 6 requests per minute)
    Route::put('guests/password', [GuestPasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('guest.password.update');   // Update password

    // Guest membership management routes
    Route::patch('guests/memberships/{membership}', [GuestProfileController::class, 'updateMembership'])
        ->name('guest.membership.update');    // Update membership application

    Route::delete('guests/memberships/{membership}', [GuestProfileController::class, 'deleteMembership'])
        ->name('guest.membership.delete');    // Delete membership application
});
