<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;

class ContactMessageController extends Controller
{
    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $user = Auth::user();

        ContactMessage::create([
            'user_id' => $user?->id,
            'name' => (string) ($validated['name'] ?? ''),
            'email' => (string) ($user?->email ?? ($validated['email'] ?? '')),
            'message' => (string) ($validated['message'] ?? ''),
            'ip_address' => (string) (request()->server('REMOTE_ADDR') ?? ''),
            'user_agent' => (string) (request()->server('HTTP_USER_AGENT') ?? ''),
            'meta' => [
                'locale' => app()->getLocale(),
                'referer' => (string) (request()->server('HTTP_REFERER') ?? ''),
            ],
        ]);

        return back()->with('success', 'Your message has been sent.');
    }
}

?>

