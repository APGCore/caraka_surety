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
        User::create([
            'name' => 'Admin',
            'email' => 'adminbpr1@gmail.com',
            'password' => bcrypt('password'),
            'profile_id' => 1,
            'role_id' => 1,
        ]);

        User::create([
            'name' => 'Direksi',
            'email' => 'direksibpr@gmail.com',
            'password' => bcrypt('password'),
            'profile_id' => 1,
            'role_id' => 2,
        ]);

        User::create([
            'name' => 'Kepala Cabang',
            'email' => 'branchmanagerbpr@gmail.com',
            'password' => bcrypt('password'),
            'profile_id' => 2,
            'role_id' => 3,
        ]);

        User::create([
            'name' => 'Manager',
            'email' => 'managerbpr@gmailc.com',
            'password' => bcrypt('password'),
            'profile_id' => 1,
            'role_id' => 4,
        ]);

        User::create([
            'name' => 'Staff',
            'email' => 'staffbpr@gmail.com',
            'password' => bcrypt('password'),
            'profile_id' => 1,
            'role_id' => 5,
        ]);
    }
}
