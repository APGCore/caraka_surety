<?php

namespace Database\Seeders;

use App\Enums\RoleEnum;
use App\Models\Role;
use Illuminate\Database\Seeder;

class Roles extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = RoleEnum::getValues();

        foreach ($roles as $role) {
            Role::query()->create([
                'name' => $role,
            ]);
        }
    }
}
