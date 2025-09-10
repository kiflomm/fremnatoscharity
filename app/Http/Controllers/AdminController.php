<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Story;
use App\Models\News;
use App\Models\Role;
use App\Models\NewsComment;
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
            'totalStories' => Story::count(),
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
            'email_verified_at' => now(), // Editor users are always verified
        ]);

        return redirect()->route('admin.users')->with('success', 'Editor created');
    }

    public function stories()
    {
        $stories = Story::with(['author'])
            ->withCount(['comments', 'likes'])
            ->latest('created_at')
            ->get()
            ->map(function (Story $story) {
                return [
                    'id' => $story->id,
                    'title' => $story->story_title,
                    'content' => $story->story_description,
                    'attachment_type' => $story->attachment_type,
                    'attachment_url' => $story->attachment_url,
                    'beneficiary_name' => $story->beneficiary_name,
                    'beneficiary_age_group' => $story->beneficiary_age_group,
                    'beneficiary_gender' => $story->beneficiary_gender,
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
                    'likes_count' => $story->likes_count,
                ];
            });

        return Inertia::render('admin/stories', [
            'stories' => $stories,
            'totalStories' => Story::count(),
        ]);
    }

    /**
     * Store a new story.
     */
    public function storeStory(Request $request)
    {
        $validated = $request->validate([
            'story_title' => ['required', 'string', 'max:255'],
            'story_description' => ['required', 'string'],
            'attachment_type' => ['required', 'in:image,video,none'],
            'attachment_url' => ['nullable', 'url', 'max:2048'],
            'beneficiary_name' => ['nullable', 'string', 'max:255'],
            'beneficiary_age_group' => ['required', 'in:child,youth,elder'],
            'beneficiary_gender' => ['required', 'in:male,female'],
        ]);

        if (in_array($validated['attachment_type'], ['image', 'video']) && empty($validated['attachment_url'])) {
            return back()->withErrors(['attachment_url' => 'Attachment URL is required for images or videos.'])->withInput();
        }

        Story::create([
            'story_title' => $validated['story_title'],
            'story_description' => $validated['story_description'],
            'attachment_type' => $validated['attachment_type'],
            'attachment_url' => $validated['attachment_url'] ?? null,
            'beneficiary_name' => $validated['beneficiary_name'] ?? null,
            'beneficiary_age_group' => $validated['beneficiary_age_group'],
            'beneficiary_gender' => $validated['beneficiary_gender'],
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('admin.stories')->with('success', 'Story created');
    }

    /**
     * Update an existing story (limited fields for admin quick edit).
     */
    public function updateStory(Request $request, Story $story)
    {
        $validated = $request->validate([
            'story_title' => ['required', 'string', 'max:255'],
            'story_description' => ['required', 'string'],
            'attachment_type' => ['required', 'in:image,video,none'],
            'attachment_url' => ['nullable', 'url', 'max:2048'],
            'beneficiary_name' => ['nullable', 'string', 'max:255'],
            'beneficiary_age_group' => ['required', 'in:child,youth,elder'],
            'beneficiary_gender' => ['required', 'in:male,female'],
        ]);

        if (in_array($validated['attachment_type'], ['image', 'video']) && empty($validated['attachment_url'])) {
            return back()->withErrors(['attachment_url' => 'Attachment URL is required for images or videos.'])->withInput();
        }

        $story->update([
            'story_title' => $validated['story_title'],
            'story_description' => $validated['story_description'],
            'attachment_type' => $validated['attachment_type'],
            'attachment_url' => $validated['attachment_url'] ?? null,
            'beneficiary_name' => $validated['beneficiary_name'] ?? null,
            'beneficiary_age_group' => $validated['beneficiary_age_group'],
            'beneficiary_gender' => $validated['beneficiary_gender'],
        ]);

        return back()->with('success', 'Story updated');
    }

    /**
     * Delete a story.
     */
    public function destroyStory(Story $story)
    {
        $story->delete();
        return back()->with('success', 'Story deleted');
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
            ->withCount(['comments', 'likes'])
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
                    'likes_count' => $post->likes_count,
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
        ]);
    }

    /**
     * Store a new news post.
     */
    public function storeNews(Request $request)
    {
        $validated = $request->validate([
            'news_title' => ['required', 'string', 'max:255'],
            'news_description' => ['required', 'string'],
            'attachment_type' => ['required', 'in:image,video,none'],
            'attachment_url' => ['nullable', 'url', 'max:2048'],
        ]);

        if (in_array($validated['attachment_type'], ['image', 'video']) && empty($validated['attachment_url'])) {
            return back()->withErrors(['attachment_url' => 'Attachment URL is required for images or videos.'])->withInput();
        }

        // Normalize and validate YouTube URLs for video attachments
        if ($validated['attachment_type'] === 'video') {
            $videoId = $this->extractYouTubeId($validated['attachment_url'] ?? '');
            if (!$videoId) {
                return back()->withErrors(['attachment_url' => 'Please provide a valid YouTube link (watch, share, or embed URL).'])->withInput();
            }
            // Store a canonical embed URL for consistent rendering on the client
            $validated['attachment_url'] = 'https://www.youtube-nocookie.com/embed/' . $videoId . '?rel=0&modestbranding=1';
        }

        News::create([
            'news_title' => $validated['news_title'],
            'news_description' => $validated['news_description'],
            'attachment_type' => $validated['attachment_type'],
            'attachment_url' => $validated['attachment_url'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        return redirect()->route('admin.news')->with('success', 'News created');
    }

    /**
     * Update an existing news post.
     */
    public function updateNews(Request $request, News $news)
    {
        $validated = $request->validate([
            'news_title' => ['required', 'string', 'max:255'],
            'news_description' => ['required', 'string'],
            'attachment_type' => ['required', 'in:image,video,none'],
            'attachment_url' => ['nullable', 'url', 'max:2048'],
        ]);

        if (in_array($validated['attachment_type'], ['image', 'video']) && empty($validated['attachment_url'])) {
            return back()->withErrors(['attachment_url' => 'Attachment URL is required for images or videos.'])->withInput();
        }

        if ($validated['attachment_type'] === 'video') {
            $videoId = $this->extractYouTubeId($validated['attachment_url'] ?? '');
            if (!$videoId) {
                return back()->withErrors(['attachment_url' => 'Please provide a valid YouTube link (watch, share, or embed URL).'])->withInput();
            }
            $validated['attachment_url'] = 'https://www.youtube-nocookie.com/embed/' . $videoId . '?rel=0&modestbranding=1';
        }

        $news->update([
            'news_title' => $validated['news_title'],
            'news_description' => $validated['news_description'],
            'attachment_type' => $validated['attachment_type'],
            'attachment_url' => $validated['attachment_url'] ?? null,
        ]);

        return back()->with('success', 'News updated');
    }

    /**
     * Delete a news post.
     */
    public function destroyNews(News $news)
    {
        $news->delete();
        return back()->with('success', 'News deleted');
    }

    /**
     * Extract a YouTube video ID from various URL formats.
     */
    private function extractYouTubeId(string $url): ?string
    {
        if ($url === '') {
            return null;
        }

        // Patterns: youtu.be/VIDEOID, youtube.com/watch?v=VIDEOID, youtube.com/embed/VIDEOID, shorts/VIDEOID
        $patterns = [
            '#youtu\.be/([A-Za-z0-9_-]{11})#',
            '#youtube\.com\/(?:watch\?v=|embed/|v/|shorts/)([A-Za-z0-9_-]{11})#',
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $url, $matches)) {
                return $matches[1];
            }
        }

        // Fallback: parse query param v
        $parts = parse_url($url);
        if (!empty($parts['query'])) {
            parse_str($parts['query'], $q);
            if (!empty($q['v']) && is_string($q['v']) && preg_match('/^[A-Za-z0-9_-]{11}$/', $q['v'])) {
                return $q['v'];
            }
        }

        return null;
    }

    public function showNews(News $news)
    {
        $news->load(['author', 'comments.user', 'likes']);

        // Normalize existing stored URLs to a safe embeddable URL
        $attachmentUrl = $news->attachment_url;
        if ($news->attachment_type === 'video') {
            $videoId = $this->extractYouTubeId($attachmentUrl ?? '');
            if ($videoId) {
                $attachmentUrl = 'https://www.youtube-nocookie.com/embed/' . $videoId . '?rel=0&modestbranding=1';
            }
        }

        $payload = [
            'id' => $news->id,
            'title' => $news->news_title,
            'description' => $news->news_description,
            'attachmentType' => $news->attachment_type,
            'attachmentUrl' => $attachmentUrl,
            'createdAt' => $news->created_at?->toISOString(),
            'likesCount' => $news->likes()->count(),
            'comments' => $news->comments->map(function (NewsComment $c) {
                return [
                    'id' => $c->id,
                    'text' => $c->comment_text,
                    'author' => [
                        'id' => $c->user?->id,
                        'name' => $c->user?->name ?? 'Unknown',
                    ],
                    'createdAt' => $c->created_at?->toISOString(),
                ];
            }),
        ];

        return Inertia::render('admin/news-show', [
            'news' => $payload,
        ]);
    }

    public function destroyNewsComment(News $news, NewsComment $comment)
    {
        if ($comment->news_id !== $news->id) {
            abort(404);
        }
        $comment->delete();
        return back()->with('success', 'Comment deleted');
    }

}
