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
                'district_id' => 53,
                'village' => 'Cempaka Mas',
                'postal_code' => '10120',
                'code' => '42',
                'name' => 'PT. Dummy',
                'email' => 'dummy@gmail.com',
                'address' => 'Jl. Letjen Suprapto Kav. 1',
                'telephone' => '08123456789',
                'fax' => '0211234567',
                'pic' => 'Dummy',
            ],
            [
                'head_id' => 1,
                'province_id' => 11,
                'regency_id' => 97,
                'district_id' => 53,
                'village' => 'Cempaka Mas',
                'postal_code' => '10120',
                'code' => '42',
                'name' => 'PT. Dummy',
                'email' => 'dummy@gmail.com',
                'address' => 'Jl. Letjen Suprapto Kav. 1',
                'telephone' => '08123456789',
                'fax' => '0211234567',
                'pic' => 'Dummy',
            ],
        ];

        foreach ($datas as $data) {
            Guarantor::query()->create($data);
        }
    }
}
