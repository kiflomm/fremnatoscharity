<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AdminOrEditor
{
    /**
     * Allow only authenticated users with admin or editor role.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $isAllowed = (method_exists($user, 'isAdmin') && $user->isAdmin()) || (method_exists($user, 'isEditor') && $user->isEditor());

        if (!$isAllowed) {
            abort(403, 'Access denied. Admin or Editor privileges required.');
        }

        return $next($request);
    }
}


