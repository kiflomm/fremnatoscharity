<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('users');
    Route::get('/stories', [AdminController::class, 'stories'])->name('stories');
    Route::get('/news', [AdminController::class, 'news'])->name('news');
    Route::get('/comments', [AdminController::class, 'comments'])->name('comments');
});
