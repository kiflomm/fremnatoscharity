<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Story;
use App\Models\News;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'totalUsers' => User::count(),
            // Keep prop names expected by the frontend, sourced from existing models
            'totalBeneficiaries' => Story::count(),
            'totalNewsPosts' => News::count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
        ]);
    }

    public function users()
    {
        $users = User::with('role')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role?->name ?? 'guest',
                    'status' => $user->email_verified_at ? 'active' : 'inactive',
                    'created_at' => $user->created_at->toISOString(),
                    'avatar' => $user->profile_photo_url,
                ];
            });

        $editorRoleId = Role::query()->where('name', 'editor')->value('id');
        $guestRoleId = Role::query()->where('name', 'guest')->value('id');

        $stats = [
            'totalUsers' => User::count(),
            'editorUsers' => $editorRoleId ? User::where('role_id', $editorRoleId)->count() : 0,
            'guestUsers' => $guestRoleId ? User::where('role_id', $guestRoleId)->count() : 0,
        ];

        return Inertia::render('admin/users', [
            'users' => $users,
            'totalUsers' => $stats['totalUsers'],
            'editorUsers' => $stats['editorUsers'],
            'guestUsers' => $stats['guestUsers'],
        ]);
    }

    /**
     * Create a new editor user.
     */
    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        $editorRoleId = Role::query()->where('name', 'editor')->value('id');

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $editorRoleId,
        ]);

        return redirect()->route('admin.users')->with('success', 'Editor created');
    }

    public function stories()
    {
        $stories = Story::with(['author'])
            ->withCount('comments')
            ->latest('created_at')
            ->get()
            ->map(function (Story $story) {
                return [
                    'id' => $story->id,
                    'title' => $story->story_title,
                    'content' => $story->story_description,
                    'beneficiary_name' => $story->beneficiary_name,
                    'beneficiary_photo' => null,
                    'status' => 'published',
                    'author' => [
                        'name' => $story->author?->name ?? 'Unknown',
                        'email' => $story->author?->email ?? '',
                    ],
                    'created_at' => $story->created_at?->toISOString(),
                    'updated_at' => $story->updated_at?->toISOString(),
                    'views' => 0,
                    'comments_count' => $story->comments_count,
                ];
            });

        $stats = [
            'totalStories' => Story::count(),
            'publishedStories' => Story::count(),
            'draftStories' => 0,
        ];

        return Inertia::render('admin/stories', [
            'stories' => $stories,
            'totalStories' => $stats['totalStories'],
            'publishedStories' => $stats['publishedStories'],
            'draftStories' => $stats['draftStories'],
        ]);
    }

    /**
     * Update user's basic details.
     */
    public function updateUser(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:'.User::class.',email,'.$user->id],
            'password' => ['nullable', 'confirmed', 'min:8'],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }
        $user->save();

        return back()->with('success', 'User updated');
    }

    /**
     * Update only the user's role.
     */
    public function updateUserRole(Request $request, User $user)
    {
        $validated = $request->validate([
            'role' => ['required', 'in:editor,guest'],
        ]);

        $roleId = Role::query()->where('name', $validated['role'])->value('id');
        $user->role_id = $roleId;
        $user->save();

        return back()->with('success', 'Role updated');
    }

    /**
     * Delete a user.
     */
    public function destroyUser(User $user)
    {
        $user->delete();
        return back()->with('success', 'User deleted');
    }

    public function news()
    {
        $posts = News::with(['author'])
            ->withCount('comments')
            ->latest('created_at')
            ->get()
            ->map(function (News $post) {
                return [
                    'id' => $post->id,
                    'title' => $post->news_title,
                    'content' => $post->news_description,
                    'excerpt' => str(\strip_tags($post->news_description))->limit(140)->toString(),
                    'status' => 'published',
                    'author' => [
                        'name' => $post->author?->name ?? 'Unknown',
                        'email' => $post->author?->email ?? '',
                        'avatar' => null,
                    ],
                    'category' => [
                        'name' => 'General',
                        'color' => '#6b7280',
                    ],
                    'created_at' => $post->created_at?->toISOString(),
                    'updated_at' => $post->updated_at?->toISOString(),
                    'published_at' => null,
                    'views' => 0,
                    'comments_count' => $post->comments_count,
                    'featured_image' => $post->attachment_url,
                ];
            });

        $stats = [
            'totalPosts' => News::count(),
            'publishedPosts' => News::count(),
            'draftPosts' => 0,
        ];

        return Inertia::render('admin/news', [
            'posts' => $posts,
            'totalPosts' => $stats['totalPosts'],
            'publishedPosts' => $stats['publishedPosts'],
            'draftPosts' => $stats['draftPosts'],
        ]);
    }


}
