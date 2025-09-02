<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $user = $request->user();

        if ($user && method_exists($user, 'isGuest') && $user->isGuest()) {
            return redirect()->route('home');
        }

        // Default for admins/editors or other roles
        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
