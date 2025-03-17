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
            //            [
            //                'province_id' => 11,
            //                'regency_id' => 97,
            //                'district_id' => 49,
            //                'village' => 'Gambir',
            //                'postal_code' => '10110',
            //                'code' => '40',
            //                'name' => 'PT VIDEI',
            //                'email' => 'videi@gmail.com',
            //                'address' => 'Jl. Kebon Sirih No. 1',
            //                'telephone' => '08123456789',
            //                'fax' => '0211234567',
            //                'pic' => 'Budi',
            //            ],
            //            [
            //                'province_id' => 11,
            //                'regency_id' => 97,
            //                'district_id' => 49,
            //                'village' => 'Gambir',
            //                'postal_code' => '10110',
            //                'code' => '41',
            //                'name' => 'PT BUMIDA',
            //                'email' => 'bumida@gmail.com',
            //                'address' => 'Jl. Kebon Sirih No. 2',
            //                'telephone' => '08123456789',
            //                'fax' => '0211234567',
            //                'pic' => 'Andre',
            //            ],
            [
                'province_id' => 11,
                'regency_id' => 97,
                'district_id' => 53,
                'village' => 'Cempaka Mas',
                'postal_code' => '10120',
                'code' => '42',
                'name' => 'PT. Asuransi Jasa Tania Tbk.',
                'email' => 'cempaka@jastan.co.id',
                'address' => 'Jl. Letjen Suprapto Kav. 1',
                'telephone' => '08123456789',
                'fax' => '0211234567',
                'pic' => 'Frenkky F Karuniadi',
            ],
            //            [
            //                'headquarter_id' => 3,
            //                'province_id' => 8,
            //                'regency_id' => 150,
            //                'district_id' => 314,
            //                'village' => 'Rawa Laut',
            //                'postal_code' => '35118',
            //                'code' => '04',
            //                'name' => 'PT. Asuransi Jasa Tania KC Lampung',
            //                'email' => 'lampung@jastan.co.id',
            //                'address' => 'Jl. Jend. Sudirman No. 82',
            //                'telephone' => '081215003232',
            //                'fax' => '-',
            //                'pic' => 'Budy Santoso',
            //            ],
            //            [
            //                'headquarter_id' => 3,
            //                'province_id' => 12,
            //                'regency_id' => 72,
            //                'district_id' => 19,
            //                'village' => 'Bandung',
            //                'postal_code' => '1245555',
            //                'code' => '05',
            //                'name' => 'PT. Asuransi Jasa Tania KC Bandung',
            //                'email' => 'bandung@jastan.co.id',
            //                'address' => 'Bandung',
            //                'telephone' => '08123456789',
            //                'fax' => 'da',
            //                'pic' => 'Drs. Erwin',
            //            ],
        ];

        foreach ($datas as $data) {
            Guarantor::query()->create($data);
        }
    }
}
