<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProfessionalHelpCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminProfessionalHelpCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $categories = ProfessionalHelpCategory::ordered()->paginate(10);

        return Inertia::render('admin/professional-help-categories/index', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'translations' => ['nullable', 'array'],
            'translations.*' => ['string', 'max:255'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        ProfessionalHelpCategory::create($validated);

        return redirect()->route('admin.professional-help-categories.index')
            ->with('success', 'Professional help category created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProfessionalHelpCategory $professionalHelpCategory)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'translations' => ['nullable', 'array'],
            'translations.*' => ['string', 'max:255'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ]);

        $professionalHelpCategory->update($validated);

        return redirect()->route('admin.professional-help-categories.index')
            ->with('success', 'Professional help category updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProfessionalHelpCategory $professionalHelpCategory)
    {
        $professionalHelpCategory->delete();

        return redirect()->route('admin.professional-help-categories.index')
            ->with('success', 'Professional help category deleted successfully.');
    }
}
