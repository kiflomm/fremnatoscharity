<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RequireEmailVerification
{
    /**
     * Handle an incoming request.
     * Require email verification for guest users to access certain pages.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check()) {
            $user = Auth::user();
            
            // If user is a guest and not verified, redirect to verification notice
            if (method_exists($user, 'isGuest') && $user->isGuest() && !$user->isVerified()) {
                return redirect()->route('verification.notice');
            }
        }

        return $next($request);
    }
}
