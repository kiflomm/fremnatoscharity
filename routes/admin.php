<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminStoryController;
use App\Http\Controllers\Admin\AdminNewsController;
use App\Http\Controllers\Admin\AdminBankController;
use App\Http\Controllers\Admin\AdminContactMessageController;

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
    
    // Banks management
    Route::get('/banks', [AdminBankController::class, 'index'])->name('banks.index');
    Route::post('/banks', [AdminBankController::class, 'store'])->name('banks.store');
    Route::put('/banks/{bank}', [AdminBankController::class, 'update'])->name('banks.update');
    Route::delete('/banks/{bank}', [AdminBankController::class, 'destroy'])->name('banks.destroy');
    Route::post('/banks/{bank}/accounts', [AdminBankController::class, 'storeAccount'])->name('banks.accounts.store');
    Route::put('/banks/{bank}/accounts/{account}', [AdminBankController::class, 'updateAccount'])->name('banks.accounts.update');
    Route::delete('/banks/{bank}/accounts/{account}', [AdminBankController::class, 'destroyAccount'])->name('banks.accounts.destroy');

    // Contact messages management
    Route::get('/messages', [AdminContactMessageController::class, 'index'])->name('messages.index');
    Route::delete('/messages/{message}', [AdminContactMessageController::class, 'destroy'])->name('messages.destroy');
});
