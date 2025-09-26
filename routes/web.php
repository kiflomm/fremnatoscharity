<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia; 
use Illuminate\Http\Request;
use App\Http\Controllers\PublicNewsController;
use App\Http\Controllers\PublicStoriesController;
use App\Http\Controllers\Api\BankController;
use App\Http\Controllers\ContactMessageController;

// Home route (welcome page)
Route::get('/', function () {
    return Inertia::render('welcome');
})->middleware(['public.only', 'require.email.verification'])->name('home');

// Public contact messages (contact form submissions)
Route::post('/contact-messages', [ContactMessageController::class, 'store'])->name('contact-messages.store');

// Banks API (for donation section)
Route::get('/api/banks', [BankController::class, 'index'])->name('api.banks.index');

// Authenticated dashboard route (role-based redirect)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        $user = $request->user();

        // Redirect guests to home, editors to editor dashboard, others to admin dashboard
        if ($user && method_exists($user, 'isGuest') && $user->isGuest()) {
            return redirect()->route('home');
        }

        if ($user && method_exists($user, 'isEditor') && $user->isEditor()) {
            return redirect()->route('editor.dashboard');
        }

        return redirect()->route('admin.dashboard');
    })->name('dashboard');
});

// Modular route includes for better organization
require __DIR__.'/settings.php';
require __DIR__.'/guest.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/editor.php';

// Public content routes (accessible to guests and logged-in guests only)
Route::middleware(['public.only'])->group(function () {
    // News routes

    /* 
    Public News Index Route
    Displays a paginated list of published news articles to all users (guests and logged-in guests).
    Controller: PublicNewsController@index
    Route name: public.news.index
    */
    Route::get('/news', [PublicNewsController::class, 'index'])->name('public.news.index');

    /* 
    Public News Show Route
    Displays a single news article to all users (guests and logged-in guests).
    Controller: PublicNewsController@show
    Route name: public.news.show
    */
    Route::get('/news/{news}', [PublicNewsController::class, 'show'])->name('public.news.show');
    Route::post('/news/{news}/comments', [PublicNewsController::class, 'comment'])
        ->middleware(['auth', 'verified'])
        ->name('public.news.comment');
    Route::post('/news/{news}/like', [PublicNewsController::class, 'toggleLike'])
        ->middleware(['auth', 'verified'])
        ->name('public.news.like');

    // Stories routes
    Route::get('/stories', [PublicStoriesController::class, 'index'])->name('public.stories.index');
    Route::get('/stories/elders', [PublicStoriesController::class, 'elders'])->name('public.stories.elders');
    Route::get('/stories/children', [PublicStoriesController::class, 'children'])->name('public.stories.children');
    Route::get('/stories/disabled', [PublicStoriesController::class, 'disabled'])->name('public.stories.disabled');
    Route::get('/stories/{story}', [PublicStoriesController::class, 'show'])->name('public.stories.show');
    Route::post('/stories/{story}/comments', [PublicStoriesController::class, 'comment'])
        ->middleware(['auth', 'verified'])
        ->name('public.stories.comment');
    Route::post('/stories/{story}/like', [PublicStoriesController::class, 'toggleLike'])
        ->middleware(['auth', 'verified'])
        ->name('public.stories.like');
});
