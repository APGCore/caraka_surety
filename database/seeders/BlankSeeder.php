<?php

namespace Database\Seeders;

use App\Models\Guarantor\Blank;
use Illuminate\Database\Seeder;

class BlankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $blanks = [
            [
                'guarantor_id' => 1,
                'profile_id' => 1,
                'number' => '1000',
            ],
            [
                'guarantor_id' => 1,
                'profile_id' => 1,
                'number' => '1001',
            ],
            [
                'guarantor_id' => 1,
                'profile_id' => 1,
                'number' => '1002',
            ],
            [
                'guarantor_id' => 1,
                'profile_id' => 1,
                'number' => '1003',
            ],
            [
                'guarantor_id' => 1,
                'profile_id' => 1,
                'number' => '1004',
            ],
            [
                'guarantor_id' => 1,
                'profile_id' => 1,
                'number' => '1005',
            ],
            [
                'guarantor_id' => 1,
                'number' => '1006',
            ],
            [
                'guarantor_id' => 1,
                'number' => '1007',
            ],
            [
                'guarantor_id' => 1,
                'number' => '1008',
            ],
            [
                'guarantor_id' => 1,
                'number' => '1009',
            ],
            [
                'guarantor_id' => 1,
                'number' => '1010',
            ],
        ];

        foreach ($blanks as $blank) {
            Blank::query()->create($blank);
        }
    }
}
