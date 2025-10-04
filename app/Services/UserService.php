<?php

namespace App\Services;

use App\Models\User;
use App\Models\Role;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Collection;

class UserService
{
    public function getAllUsers(): Collection
    {
        return User::with('role')
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
    }

    public function getUserStats(): array
    {
        $editorRoleId = Role::query()->where('name', 'editor')->value('id');
        $guestRoleId = Role::query()->where('name', 'guest')->value('id');

        return [
            'totalUsers' => User::count(),
            'editorUsers' => $editorRoleId ? User::where('role_id', $editorRoleId)->count() : 0,
            'guestUsers' => $guestRoleId ? User::where('role_id', $guestRoleId)->count() : 0,
        ];
    }

    public function createUser(array $data): User
    {
        $roleId = Role::query()->where('name', $data['role'])->value('id');

        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'role_id' => $roleId,
            'email_verified_at' => now(),
        ]);
    }

    public function updateUser(User $user, array $data): User
    {
        if (array_key_exists('name', $data)) {
            $user->name = $data['name'];
        }
        if (array_key_exists('email', $data)) {
            $user->email = $data['email'];
        }
        
        if (!empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        if (isset($data['role'])) {
            $roleId = Role::query()->where('name', $data['role'])->value('id');
            $user->role_id = $roleId;
        }

        $user->save();
        return $user;
    }

    public function deleteUser(User $user): bool
    {
        return $user->delete();
    }
}
