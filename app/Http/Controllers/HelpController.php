<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HelpController extends Controller
{
    /**
     * Display the help/donation form page
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        return Inertia::render('help', [
            'isAuthenticated' => $user !== null,
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ] : null,
        ]);
    }
}
