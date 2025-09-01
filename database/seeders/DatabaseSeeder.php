<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Seed roles first
        $this->call(RoleSeeder::class);

        // Create a default admin user
        User::updateOrCreate(
            ['email' => 'admin@fremnatos.org'], // Search by email
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role_id' => 1, // admin role
            ]
        );

        // Create a default editor user
        User::updateOrCreate(
            ['email' => 'editor@fremnatos.org'], // Search by email
            [
                'name' => 'Editor User',
                'password' => Hash::make('password'),
                'role_id' => 2, // editor role
            ]
        );
    }
}
