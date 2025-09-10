<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Http\Requests\Admin\UpdateUserRequest;
use App\Models\User;
use App\Services\UserService;
use Inertia\Inertia;

class AdminUserController extends BaseController
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index()
    {
        $users = $this->userService->getAllUsers();
        $stats = $this->userService->getUserStats();

        return $this->renderPage('admin/users', [
            'users' => $users,
            'totalUsers' => $stats['totalUsers'],
            'editorUsers' => $stats['editorUsers'],
            'guestUsers' => $stats['guestUsers'],
        ]);
    }

    public function store(StoreUserRequest $request)
    {
        $this->userService->createUser($request->validated());

        return $this->successResponse('User created successfully', null, 'admin.users.index');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $this->userService->updateUser($user, $request->validated());

        return $this->successResponse('User updated successfully');
    }

    public function destroy(User $user)
    {
        $this->userService->deleteUser($user);

        return $this->successResponse('User deleted successfully');
    }
}
