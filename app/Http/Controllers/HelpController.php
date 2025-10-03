<?php

namespace App\Http\Controllers;

use App\Models\ProfessionalHelpCategory;
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
        
        // Get active professional help categories with full data
        $categories = ProfessionalHelpCategory::active()
            ->ordered()
            ->get();
        
        return Inertia::render('help', [
            'isAuthenticated' => $user !== null,
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ] : null,
            'professionalHelpCategories' => $categories,
        ]);
    }
}
