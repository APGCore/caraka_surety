<?php

namespace Database\Seeders;

use App\Models\RelatedParties\Obligee;
use Illuminate\Database\Seeder;

class ObligeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $obligees = [
            [
                'province_id' => 1,
                'regency_id' => 1,
                'district_id' => 1,
                'village' => 'Kebon Jeruk',
                'name' => 'PT. ABC',
                'address' => 'Jl. Karang Anyar No. 1',
                'telephone' => '08123456789',
                'fax' => '0211234567',
                'pic' => 'Budi',
            ],
            [
                'province_id' => 1,
                'regency_id' => 1,
                'district_id' => 1,
                'village' => 'Kebon Jeruk',
                'name' => 'PT. DEF',
                'address' => 'Jl. Karang Anyar No. 2',
                'telephone' => '08123456789',
                'fax' => '0211234567',
                'pic' => 'Andre',
            ],
        ];

        foreach ($obligees as $obligee) {
            Obligee::create($obligee);
        }
    }
}
