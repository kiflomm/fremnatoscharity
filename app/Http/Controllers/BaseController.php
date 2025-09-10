<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

abstract class BaseController extends Controller
{
    /**
     * Return a success response with optional data
     */
    protected function successResponse(string $message, $data = null, ?string $route = null)
    {
        if ($route) {
            return redirect()->route($route)->with('success', $message);
        }
        
        return back()->with('success', $message);
    }

    /**
     * Return an error response
     */
    protected function errorResponse(string $message, $errors = null, ?string $route = null)
    {
        if ($route) {
            return redirect()->route($route)->withErrors($errors ?? [])->with('error', $message);
        }
        
        return back()->withErrors($errors ?? [])->with('error', $message);
    }

    /**
     * Return a JSON response
     */
    protected function jsonResponse($data, int $status = 200)
    {
        return response()->json($data, $status);
    }

    /**
     * Render an Inertia page with common data
     */
    protected function renderPage(string $page, array $data = [])
    {
        return Inertia::render($page, $data);
    }

    /**
     * Get pagination parameters from request
     */
    protected function getPaginationParams(Request $request): array
    {
        return [
            'per_page' => $request->get('per_page', 15),
            'page' => $request->get('page', 1),
        ];
    }

    /**
     * Get search parameters from request
     */
    protected function getSearchParams(Request $request): array
    {
        return [
            'search' => $request->get('search', ''),
            'sort' => $request->get('sort', 'created_at'),
            'direction' => $request->get('direction', 'desc'),
        ];
    }
}
