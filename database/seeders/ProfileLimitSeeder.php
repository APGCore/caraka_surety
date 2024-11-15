<?php

namespace Database\Seeders;

use App\Models\Guarantor\ProfileLimit;
use Illuminate\Database\Seeder;

class ProfileLimitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $profileLimits = [
            [
                'guarantor_id' => 1,
                'guarantor_to_product_type_id' => 1,
                'profile_id' => 1,
                'limit' => '100000000',
            ],
            [
                'guarantor_id' => 1,
                'guarantor_to_product_type_id' => 1,
                'profile_id' => 2,
                'limit' => '50000000',
            ],
        ];

        foreach ($profileLimits as $profileLimit) {
            ProfileLimit::create($profileLimit);
        }
    }
}
