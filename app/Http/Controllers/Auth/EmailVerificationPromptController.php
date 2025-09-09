<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Show the email verification prompt page.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            // Redirect guests to home page, others to dashboard
            if (method_exists($request->user(), 'isGuest') && $request->user()->isGuest()) {
                return redirect()->intended(route('home', absolute: false));
            }
            return redirect()->intended(route('dashboard', absolute: false));
        }

        return Inertia::render('auth/verify-email', ['status' => $request->session()->get('status')]);
    }
}
