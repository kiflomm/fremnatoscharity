<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Inertia\Inertia;
use Inertia\Response;

class PasswordController extends Controller
{
    protected function ensureGuest(Request $request): void
    {
        $user = $request->user();
        if (!$user || !method_exists($user, 'isGuest') || !$user->isGuest()) {
            abort(403);
        }
    }

    /**
     * Show the guest user's password page.
     */
    public function edit(Request $request): Response
    {
        $this->ensureGuest($request);
        return Inertia::render('guests/profile');
    }

    /**
     * Update the guest user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $this->ensureGuest($request);

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', PasswordRule::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}


