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
        $users = [
            [
                'name' => 'Admin',
                'username' => 'admin',
                'email' => 'adminbpr@gmail.com',
                'password' => bcrypt('password'),
                'profile_id' => 1,
                'role_id' => 1,
            ],
            [
                'name' => 'Direksi',
                'username' => 'direksi',
                'email' => 'direksibpr@gmail.com',
                'password' => bcrypt('password'),
                'profile_id' => 1,
                'role_id' => 2,
            ],
            [
                'name' => 'Kepala Cabang',
                'username' => 'kepala-cabang',
                'email' => 'branchmanagerbpr@gmail.com',
                'password' => bcrypt('password'),
                'head_id' => 2,
                'profile_id' => 2,
                'role_id' => 3,
            ],
            [
                'name' => 'Manager',
                'username' => 'manager',
                'email' => 'managerbpr@gmail.com',
                'password' => bcrypt('password'),
                'profile_id' => 1,
                'role_id' => 4,
            ],
            [
                'name' => 'Staff',
                'username' => 'staff',
                'email' => 'staffbpr@gmail.com',
                'password' => bcrypt('password'),
                'head_id' => 4, // Manager
                'profile_id' => 1,
                'role_id' => 5,
            ],
            [
                'name' => 'Staff Cabang',
                'username' => 'staff-cabang',
                'email' => 'staffbprcabang1@gmail.com',
                'password' => bcrypt('password'),
                'head_id' => 3, // Kepala Cabang
                'profile_id' => 2,
                'role_id' => 5,
            ],
            [
                'name' => 'Finance',
                'username' => 'keuangan',
                'email' => 'keuangan@gmail.com',
                'password' => bcrypt('password'),
                'profile_id' => 1,
                'role_id' => 6,
            ],
        ];

        foreach ($users as $user) {
            User::query()->create($user);
        }
    }
}
