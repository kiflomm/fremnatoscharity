<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::post('/users', [AdminController::class, 'storeUser'])->name('users.store');
    Route::put('/users/{user}', [AdminController::class, 'updateUser'])->name('users.update');
    Route::put('/users/{user}/role', [AdminController::class, 'updateUserRole'])->name('users.role');
    Route::delete('/users/{user}', [AdminController::class, 'destroyUser'])->name('users.destroy');
    Route::get('/stories', [AdminController::class, 'stories'])->name('stories');
    Route::post('/stories', [AdminController::class, 'storeStory'])->name('stories.store');
    Route::put('/stories/{story}', [AdminController::class, 'updateStory'])->name('stories.update');
    Route::delete('/stories/{story}', [AdminController::class, 'destroyStory'])->name('stories.destroy');
    Route::get('/news', [AdminController::class, 'news'])->name('news');
    Route::get('/news/{news}', [AdminController::class, 'showNews'])->name('news.show');
    Route::post('/news', [AdminController::class, 'storeNews'])->name('news.store');
    Route::put('/news/{news}', [AdminController::class, 'updateNews'])->name('news.update');
    Route::delete('/news/{news}', [AdminController::class, 'destroyNews'])->name('news.destroy');
    Route::delete('/news/{news}/comments/{comment}', [AdminController::class, 'destroyNewsComment'])->name('news.comments.destroy');
});
