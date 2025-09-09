<?php

use App\Http\Controllers\Guests\PasswordController as GuestPasswordController;
use App\Http\Controllers\Guests\ProfileController as GuestProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Ensure only guest role users pass through. Controllers re-check.
    Route::get('guests/profile', [GuestProfileController::class, 'edit'])->name('guest.profile.edit');
    Route::patch('guests/profile', [GuestProfileController::class, 'update'])->name('guest.profile.update');
    Route::delete('guests/profile', [GuestProfileController::class, 'destroy'])->name('guest.profile.destroy');

    Route::put('guests/password', [GuestPasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('guest.password.update');
});


