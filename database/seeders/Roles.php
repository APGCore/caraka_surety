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
        $roles = RoleEnum::getRoute();

        foreach ($roles as $name => $route) {
            Role::create([
                'name' => $name,
                'route_name' => $route,
            ]);
        }
    }
}
