<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminStoryController;
use App\Http\Controllers\Admin\AdminNewsController;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // Users resource
    Route::resource('users', AdminUserController::class)->except(['show']);
    
    // Stories resource
    Route::resource('stories', AdminStoryController::class)->except(['show']);
    
    // News resource
    Route::resource('news', AdminNewsController::class);
    Route::delete('/news/{news}/comments/{comment}', [AdminNewsController::class, 'destroyComment'])->name('news.comments.destroy');
    Route::post('/news/{news}/archive', [AdminNewsController::class, 'archive'])->name('news.archive');
    Route::post('/news/{news}/unarchive', [AdminNewsController::class, 'unarchive'])->name('news.unarchive');
});
