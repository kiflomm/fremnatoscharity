<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = Auth::user();
        
        if ($user->hasVerifiedEmail()) {
            // Redirect guests to home page, others to dashboard
            if (method_exists($user, 'isGuest') && $user->isGuest()) {
                return redirect()->intended(route('home', absolute: false).'?verified=1');
            }
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        $request->fulfill();

        // Redirect guests to home page, others to dashboard
        if (method_exists($user, 'isGuest') && $user->isGuest()) {
            return redirect()->intended(route('home', absolute: false).'?verified=1');
        }
        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
