<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EditorController;

Route::middleware(['auth', 'verified', 'editor'])->prefix('editor')->name('editor.')->group(function () {
    Route::get('/dashboard', [EditorController::class, 'dashboard'])->name('dashboard');
    Route::get('/stories', [EditorController::class, 'stories'])->name('stories');
    Route::get('/news', [EditorController::class, 'news'])->name('news');
});


