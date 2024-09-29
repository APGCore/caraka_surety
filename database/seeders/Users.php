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
        ]);
    }
}
