<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */

    public function boot()
    {
        Inertia::share([
            'isAuthenticated' => function () {
                return auth()->check();
            },
            'user' => function () {
                if (auth()->check()) {
                    $user = auth()->user();
                    return [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ];
                }
                return null;
            },
        ]);
    }
}
