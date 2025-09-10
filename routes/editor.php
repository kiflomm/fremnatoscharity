<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Editor\EditorDashboardController;
use App\Http\Controllers\Editor\EditorStoryController;
use App\Http\Controllers\Editor\EditorNewsController;

Route::middleware(['auth', 'verified', 'editor'])->prefix('editor')->name('editor.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [EditorDashboardController::class, 'index'])->name('dashboard');
    
    // Stories (read-only for editors)
    Route::get('/stories', [EditorStoryController::class, 'index'])->name('stories');
    
    // News (read-only for editors)
    Route::get('/news', [EditorNewsController::class, 'index'])->name('news');
});


