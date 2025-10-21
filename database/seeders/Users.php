<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class Users extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->create([
            'name' => 'Admin',
            'username' => 'admin',
            'email' => 'adminbpr@gmail.com',
            'password' => bcrypt('password'),
            'profile_id' => 1,
            'role_id' => 1,
        ]);

        User::query()->create([
            'name' => 'Direksi',
            'username' => 'direksi',
            'email' => 'direksibpr@gmail.com',
            'password' => bcrypt('password'),
            'profile_id' => 1,
            'role_id' => 2,
        ]);

        User::query()->create([
            'name' => 'Kepala Cabang',
            'username' => 'kepala-cabang',
            'email' => 'branchmanagerbpr@gmail.com',
            'password' => bcrypt('password'),
            'head_id' => 2,
            'profile_id' => 2,
            'role_id' => 3,
        ]);

        User::query()->create([
            'name' => 'Manager',
            'username' => 'manager',
            'email' => 'managerbpr@gmail.com',
            'password' => bcrypt('password'),
            'profile_id' => 1,
            'role_id' => 4,
        ]);

        User::query()->create([
            'name' => 'Staff',
            'username' => 'staff',
            'email' => 'staffbpr@gmail.com',
            'password' => bcrypt('password'),
            'head_id' => 4, // Manager
            'profile_id' => 1,
            'role_id' => 5,
        ]);

        User::query()->create([
            'name' => 'Staff Cabang',
            'username' => 'staff-cabang',
            'email' => 'staffbprcabang1@gmail.com',
            'password' => bcrypt('password'),
            'head_id' => 3, // Kepala Cabang
            'profile_id' => 2,
            'role_id' => 5,
        ]);

        User::query()->create([
            'name' => 'Finance',
            'username' => 'keuangan',
            'email' => 'keuangan@gmail.com',
            'password' => bcrypt('password'),
            'profile_id' => 1,
            'role_id' => 6,
        ]);
    }
}
