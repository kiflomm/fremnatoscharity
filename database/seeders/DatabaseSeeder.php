<?php

namespace Database\Seeders;

use App\Models\User;
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
        
        // Seed banks and bank accounts
        $this->call(BankSeeder::class);

        // Create a default admin user
        User::updateOrCreate(
            ['email' => 'admin@fremnatos.org'], 
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role_id' => 1, // admin role
                'email_verified_at' => now(), // Admin users are always verified
            ]
        );

        // Create a default editor user
        User::updateOrCreate(
            ['email' => 'editor@fremnatos.org'], 
            [
                'name' => 'Editor User',
                'password' => Hash::make('password'),
                'role_id' => 2, // editor role
                'email_verified_at' => now(), // Editor users are always verified
            ]
        );
    }
}
