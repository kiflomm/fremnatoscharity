<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EditorMiddleware
{
    /**
     * Allow only authenticated users with editor role.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();
        $isEditor = method_exists($user, 'isEditor') && $user->isEditor();
        if (!$isEditor) {
            abort(403, 'Access denied. Editor privileges required.');
        }

        return $next($request);
    }
}


