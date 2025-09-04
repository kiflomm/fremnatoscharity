<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class PublicOnly
{
    /**
     * Redirect logged-in admins/editors away from public pages to their dashboard.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            if (method_exists($user, 'isAdmin') && $user->isAdmin()) {
                return redirect()->route('admin.dashboard');
            }
            if (method_exists($user, 'isEditor') && $user->isEditor()) {
                return redirect()->route('admin.dashboard');
            }
        }

        return $next($request);
    }
}


