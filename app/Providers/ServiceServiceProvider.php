<?php

namespace App\Providers;

use App\Services\DashboardService;
use App\Services\NewsService;
use App\Services\StoryService;
use App\Services\UserService;
use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(DashboardService::class);
        $this->app->singleton(NewsService::class);
        $this->app->singleton(StoryService::class);
        $this->app->singleton(UserService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
