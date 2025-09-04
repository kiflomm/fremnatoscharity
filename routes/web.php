<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\PublicNewsController;
use App\Http\Controllers\PublicStoriesController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->middleware('public.only')->name('home');

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

// Public content routes (accessible to guests and logged-in guests only)
Route::middleware(['public.only'])->group(function () {
    // News
    Route::get('/news', [PublicNewsController::class, 'index'])->name('public.news.index');
    Route::get('/news/{news}', [PublicNewsController::class, 'show'])->name('public.news.show');
    Route::post('/news/{news}/comments', [PublicNewsController::class, 'comment'])
        ->middleware(['auth', 'verified'])
        ->name('public.news.comment');
    Route::post('/news/{news}/like', [PublicNewsController::class, 'toggleLike'])
        ->middleware(['auth', 'verified'])
        ->name('public.news.like');

    // Stories
    Route::get('/stories', [PublicStoriesController::class, 'index'])->name('public.stories.index');
    Route::get('/stories/{story}', [PublicStoriesController::class, 'show'])->name('public.stories.show');
    Route::post('/stories/{story}/comments', [PublicStoriesController::class, 'comment'])
        ->middleware(['auth', 'verified'])
        ->name('public.stories.comment');
    Route::post('/stories/{story}/like', [PublicStoriesController::class, 'toggleLike'])
        ->middleware(['auth', 'verified'])
        ->name('public.stories.like');
});
