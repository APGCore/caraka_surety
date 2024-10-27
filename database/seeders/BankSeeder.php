<?php

namespace Database\Seeders;

use App\Models\RelatedParties\Bank;
use Illuminate\Database\Seeder;

class BankSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            [
                'province_id' => 11,
                'regency_id' => 97,
                'district_id' => 49,
                'village' => 'Gambir',
                'name' => 'Bank BRI Jakarta',
                'address' => 'Jl. Kebon Sirih No. 1',
                'telephone' => '08123456789',
                'fax' => '0211234567',
                'pic' => 'David',
            ],
            [
                'province_id' => 11,
                'regency_id' => 97,
                'district_id' => 49,
                'village' => 'Gambir',
                'name' => 'Bank BNI Jakarta',
                'address' => 'Jl. Kebon Sirih No. 2',
                'telephone' => '08123456789',
                'fax' => '0211234567',
                'pic' => 'Andre',
            ],
        ];

        foreach ($banks as $bank) {
            Bank::create($bank);
        }
    }
}
