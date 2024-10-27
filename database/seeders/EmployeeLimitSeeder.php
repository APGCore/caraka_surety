<?php

namespace Database\Seeders;

use App\Models\Guarantor\EmployeeLimit;
use Illuminate\Database\Seeder;

class EmployeeLimitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employeeLimits = [
            [
                'guarantor_id' => 1,
                'profile_id' => 1,
                'employee_id' => 2,
                'limit' => '70000000',
            ],
            [
                'guarantor_id' => 1,
                'profile_id' => 2,
                'employee_id' => 3,
                'limit' => '50000000',
            ],
            [
                'guarantor_id' => 1,
                'profile_id' => 1,
                'employee_id' => 4,
                'limit' => '30000000',
            ]
        ];

        foreach ($employeeLimits as $employeeLimit) {
            EmployeeLimit::create($employeeLimit);
        }
    }
}
