<?php

namespace Database\Seeders;

use App\Models\Guarantor\Guarantor;
use Illuminate\Database\Seeder;

class GuarantorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'province_id' => 11,
                'regency_id' => 97,
                'district_id' => 49,
                'village' => 'Gambir',
                'code' => '40',
                'name' => 'PT VIDEI Jakarta',
                'email' => 'videi@gmail.com',
                'address' => 'Jl. Kebon Sirih No. 1',
                'telephone' => '08123456789',
                'fax' => '0211234567',
                'pic' => 'Budi',
            ],
            [
                'province_id' => 11,
                'regency_id' => 97,
                'district_id' => 49,
                'village' => 'Gambir',
                'code' => '41',
                'name' => 'PT BUMIDA Jakarta',
                'email' => 'bumida@gmail.com',
                'address' => 'Jl. Kebon Sirih No. 2',
                'telephone' => '08123456789',
                'fax' => '0211234567',
                'pic' => 'Andre',
            ],
        ];

        foreach ($datas as $data) {
            Guarantor::create($data);
        }
    }
}
