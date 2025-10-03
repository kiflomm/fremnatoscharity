<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Membership;
use Inertia\Inertia;

class AdminMembershipController extends Controller
{
    public function index()
    {
        $memberships = Membership::with('user')->latest()->paginate(20)->through(function ($m) {
            return [
                'id' => $m->id,
                'name' => $m->name,
                'email' => $m->user?->email,
                'phone_number' => $m->phone_number,
                'help_profession' => $m->help_profession,
                'donation_amount' => $m->donation_amount,
                'donation_currency' => $m->donation_currency,
                'created_at' => $m->created_at->toISOString(),
            ];
        });

        return Inertia::render('admin/memberships', [
            'memberships' => $memberships,
        ]);
    }

    public function destroy(Membership $membership)
    {
        $membership->delete();
        return back()->with('success', 'Membership deleted');
    }
}


