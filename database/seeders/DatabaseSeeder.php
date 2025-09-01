<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@fremnatos.org',
            'role_id' => 1, // admin role
        ]);

        // Create a default editor user
        User::factory()->create([
            'name' => 'Editor User',
            'email' => 'editor@fremnatos.org',
            'role_id' => 2, // editor role
        ]);
    }
}
