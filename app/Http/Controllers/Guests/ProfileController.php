<?php

namespace App\Http\Controllers\Guests;

use App\Http\Controllers\Controller;
use App\Models\ProfessionalHelpCategory;
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

        $user = $request->user();
        
        // Get user's membership applications
        $memberships = $user->memberships()
            ->orderBy('created_at', 'desc')
            ->get();

        // Get active professional help categories with full data
        $categories = ProfessionalHelpCategory::active()
            ->ordered()
            ->get();

        return Inertia::render('guests/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'memberships' => $memberships,
            'professionalHelpCategories' => $categories,
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

        $user = $request->user();
        $user->update([
            'name' => $validated['name'],
        ]);

        return redirect()->route('guest.profile.edit');
    }

    /**
     * Update a membership application.
     */
    public function updateMembership(Request $request, $membershipId): RedirectResponse
    {
        $this->ensureGuest($request);

        $user = $request->user();
        $membership = $user->memberships()->findOrFail($membershipId);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'father_name' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'in:male,female'],
            'age' => ['nullable', 'integer', 'min:1', 'max:120'],
            'country' => ['nullable', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'woreda' => ['nullable', 'string', 'max:255'],
            'kebele' => ['nullable', 'string', 'max:255'],
            'profession' => ['nullable', 'string', 'max:255'],
            'education_level' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:20'],
            'help_profession' => ['nullable', 'array'],
            'help_profession.*' => ['string', 'max:255'],
            'donation_amount' => ['nullable', 'numeric', 'min:0'],
            'donation_currency' => ['nullable', 'string', 'max:8'],
            'donation_time' => ['nullable', 'string', 'max:255'],
            'property_type' => ['nullable', 'string', 'max:255'],
            'additional_property' => ['nullable', 'string'],
            'property_donation_time' => ['nullable', 'string', 'max:255'],
        ]);

        $membership->update($validated);

        return redirect()->route('guest.profile.edit');
    }

    /**
     * Delete a membership application.
     */
    public function deleteMembership(Request $request, $membershipId): RedirectResponse
    {
        $this->ensureGuest($request);

        $user = $request->user();
        $membership = $user->memberships()->findOrFail($membershipId);

        $membership->delete();

        return redirect()->route('guest.profile.edit');
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


