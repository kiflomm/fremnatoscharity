<?php

namespace App\Http\Controllers;

use App\Models\Membership;
use App\Models\ProfessionalHelpCategory;
use Illuminate\Http\Request;

class MembershipController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'father_name' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'max:32'],
            'age' => ['nullable', 'integer', 'min:0', 'max:120'],
            'country' => ['nullable', 'string', 'max:255'],
            'region' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:255'],
            'woreda' => ['nullable', 'string', 'max:255'],
            'kebele' => ['nullable', 'string', 'max:255'],
            'profession' => ['nullable', 'string', 'max:255'],
            'education_level' => ['nullable', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:50'],
            'help_profession' => ['nullable', 'array'],
            'help_profession.*' => ['string', 'max:255'],
            'donation_amount' => ['nullable', 'numeric', 'min:0'],
            'donation_currency' => ['nullable', 'string', 'max:8'],
            'donation_time' => ['nullable', 'string', 'max:32'],
            'property_type' => ['nullable', 'string', 'max:255'],
            'additional_property' => ['nullable', 'string'],
            'property_donation_time' => ['nullable', 'string', 'max:32'],
        ]);

        $validated['user_id'] = $request->user()->id;

        Membership::create($validated);

        return back();
    }
}


