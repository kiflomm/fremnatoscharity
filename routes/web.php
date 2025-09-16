<?php

/**
 * --------------------------------------------------------------------------
 * Web Routes
 * --------------------------------------------------------------------------
 * 
 * This file defines all web routes for the application.
 * 
 * 🏠 Home, 📰 Public News, 📚 Public Stories, 💬 Contact, 🏦 Banks API, 
 * 👤 Authenticated Dashboards, and more.
 * 
 * Route groups are organized by middleware and access level:
 *   - Public routes (guests & verified users)
 *   - Authenticated dashboards (role-based redirects)
 *   - Modular includes for settings, guest, auth, admin, and editor
 * 
 * Route naming conventions:
 *   - Use dot notation for clarity (e.g., public.news.index)
 *   - Use generated route helpers in the frontend for maintainability
 * 
 * Middleware:
 *   - 'public.only': Restricts to guests and logged-in guests
 *   - 'require.email.verification': Ensures email is verified
 *   - 'auth', 'verified': Restricts to authenticated, verified users
 * 
 * --------------------------------------------------------------------------
 * Quick Reference
 * --------------------------------------------------------------------------
 * 
 * | Route                      | Method | Controller/Action                | Middleware                | Name                      |
 * |----------------------------|--------|----------------------------------|---------------------------|---------------------------|
 * | /                          | GET    | Inertia::render('welcome')       | public.only, email.verify | home                      |
 * | /contact-messages          | POST   | ContactMessageController@store   | -                         | contact-messages.store    |
 * | /api/banks                 | GET    | BankController@index             | -                         | api.banks.index           |
 * | /dashboard                 | GET    | (role-based redirect)            | auth, verified            | dashboard                 |
 * | /news, /news/{news}        | GET    | PublicNewsController@index/show  | public.only               | public.news.index/show    |
 * | /news/{news}/comments      | POST   | PublicNewsController@comment     | auth, verified, public    | public.news.comment       |
 * | /news/{news}/like          | POST   | PublicNewsController@toggleLike  | auth, verified, public    | public.news.like          |
 * | /stories, /stories/{story} | GET    | PublicStoriesController@index/show| public.only              | public.stories.index/show |
 * | /stories/{story}/comments  | POST   | PublicStoriesController@comment  | auth, verified, public    | public.stories.comment    |
 * | /stories/{story}/like      | POST   | PublicStoriesController@toggleLike| auth, verified, public   | public.stories.like       |
 * 
 * --------------------------------------------------------------------------
 * Modular Route Includes
 * --------------------------------------------------------------------------
 * 
 * - settings.php:   Application settings routes
 * - guest.php:      Guest-only routes
 * - auth.php:       Authentication routes
 * - admin.php:      Admin dashboard & management
 * - editor.php:     Editor dashboard & management
 * 
 * --------------------------------------------------------------------------
 * Best Practices
 * --------------------------------------------------------------------------
 * - Use route names and helpers for all links in the frontend.
 * - Keep route logic minimal; delegate to controllers.
 * - Use middleware for access control and security.
 * - Organize routes for clarity and maintainability.
 * 
 * --------------------------------------------------------------------------
 */

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
    Route::get('/news', [PublicNewsController::class, 'index'])->name('public.news.index');
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
    Route::get('/stories/childrens', [PublicStoriesController::class, 'childrens'])->name('public.stories.childrens');
    Route::get('/stories/disabled', [PublicStoriesController::class, 'disabled'])->name('public.stories.disabled');
    Route::get('/stories/{story}', [PublicStoriesController::class, 'show'])->name('public.stories.show');
    Route::post('/stories/{story}/comments', [PublicStoriesController::class, 'comment'])
        ->middleware(['auth', 'verified'])
        ->name('public.stories.comment');
    Route::post('/stories/{story}/like', [PublicStoriesController::class, 'toggleLike'])
        ->middleware(['auth', 'verified'])
        ->name('public.stories.like');
});
