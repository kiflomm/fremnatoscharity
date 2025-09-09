<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Ensure only guest-role users can access these endpoints.
     */
    protected function ensureGuest(Request $request): void
    {
        $user = $request->user();
        if (!$user || !method_exists($user, 'isGuest') || !$user->isGuest()) {
            abort(403);
        }
    }

    /**
     * Show the guest user's profile page.
     */
    public function edit(Request $request): Response
    {
        $this->ensureGuest($request);

        return Inertia::render('guests/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the guest user's profile (name only).
     */
    public function update(Request $request): RedirectResponse
    {
        $this->ensureGuest($request);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->forceFill([
            'name' => $validated['name'],
        ])->save();

        return to_route('guest.profile.edit');
    }

    /**
     * Delete the guest user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $this->ensureGuest($request);

        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}


