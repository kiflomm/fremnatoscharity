<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Editor\EditorDashboardController;
use App\Http\Controllers\Editor\EditorStoryController;
use App\Http\Controllers\Editor\EditorNewsController;

Route::middleware(['auth', 'verified', 'editor'])->prefix('editor')->name('editor.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [EditorDashboardController::class, 'index'])->name('dashboard');

    // News management (CRUD + archive)
    Route::get('/news', [EditorNewsController::class, 'index'])->name('news.index');
    Route::get('/news/{news}', [EditorNewsController::class, 'show'])->name('news.show');
    Route::post('/news', [EditorNewsController::class, 'store'])->name('news.store');
    Route::put('/news/{news}', [EditorNewsController::class, 'update'])->name('news.update');
    Route::delete('/news/{news}', [EditorNewsController::class, 'destroy'])->name('news.destroy');
    Route::delete('/news/{news}/comments/{comment}', [EditorNewsController::class, 'destroyComment'])->name('news.comments.destroy');
    Route::post('/news/{news}/archive', [EditorNewsController::class, 'archive'])->name('news.archive');
    Route::post('/news/{news}/unarchive', [EditorNewsController::class, 'unarchive'])->name('news.unarchive');

    // Stories management (CRUD + archive)
    Route::get('/stories', [EditorStoryController::class, 'index'])->name('stories.index');
    Route::get('/stories/{story}', [EditorStoryController::class, 'show'])->name('stories.show');
    Route::post('/stories', [EditorStoryController::class, 'store'])->name('stories.store');
    Route::put('/stories/{story}', [EditorStoryController::class, 'update'])->name('stories.update');
    Route::delete('/stories/{story}', [EditorStoryController::class, 'destroy'])->name('stories.destroy');
    Route::post('/stories/{story}/archive', [EditorStoryController::class, 'archive'])->name('stories.archive');
    Route::post('/stories/{story}/unarchive', [EditorStoryController::class, 'unarchive'])->name('stories.unarchive');
});


