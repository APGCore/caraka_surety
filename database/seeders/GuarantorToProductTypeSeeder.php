<?php

namespace Database\Seeders;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Models\Guarantor\GuarantorToProductType;
use Illuminate\Database\Seeder;

class GuarantorToProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $dataMany = [
            [
                'guarantor_id' => 1,
                'product_id' => 1,
                'product_type_id' => 1,
                'no' => 1,
                'code_product' => '14',
                'code' => '90.01',
                'name' => 'Jaminan Penawaran',
                'job_group' => JobGroup::KONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Penawaran Konstruksi',
            ],
            [
                'guarantor_id' => 1,
                'product_id' => 1,
                'product_type_id' => 1,
                'no' => 1,
                'code_product' => '14',
                'code' => '90.02',
                'name' => 'Jaminan Penawaran',
                'job_group' => JobGroup::NONKONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Penawaran Non Konstruksi',
            ],
            [
                'guarantor_id' => 1,
                'product_id' => 1,
                'product_type_id' => 2,
                'no' => 4,
                'code_product' => '14',
                'code' => '91.01',
                'name' => 'Jaminan Pelaksanaan',
                'job_group' => JobGroup::KONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Pelaksanaan Konstruksi',
            ],
            [
                'guarantor_id' => 1,
                'product_id' => 1,
                'product_type_id' => 2,
                'no' => 4,
                'code_product' => '14',
                'code' => '91.02',
                'name' => 'Jaminan Pelaksanaan',
                'job_group' => JobGroup::NONKONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Pelaksanaan Non Konstruksi',
            ],

            [
                'guarantor_id' => 1,
                'product_id' => 2,
                'product_type_id' => 1,
                'no' => 1,
                'code_product' => '15',
                'code' => '90.01',
                'name' => 'Jaminan Penawaran',
                'job_group' => JobGroup::KONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Penawaran Konstruksi',
            ],
            [
                'guarantor_id' => 1,
                'product_id' => 2,
                'product_type_id' => 1,
                'no' => 1,
                'code_product' => '15',
                'code' => '90.02',
                'name' => 'Jaminan Penawaran',
                'job_group' => JobGroup::NONKONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Penawaran Non Konstruksi',
            ],
            [
                'guarantor_id' => 1,
                'product_id' => 2,
                'product_type_id' => 2,
                'no' => 4,
                'code_product' => '15',
                'code' => '91.01',
                'name' => 'Jaminan Pelaksanaan',
                'job_group' => JobGroup::KONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Pelaksanaan Konstruksi',
            ],
            [
                'guarantor_id' => 1,
                'product_id' => 2,
                'product_type_id' => 2,
                'no' => 4,
                'code_product' => '15',
                'code' => '91.02',
                'name' => 'Jaminan Pelaksanaan',
                'job_group' => JobGroup::NONKONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Pelaksanaan Non Konstruksi',
            ],
        ];

        // Asuransi tambahan (lihat GuarantorSeeder): id 3, 5, 7, 9, 11, 13 adalah
        // headquarter dari 6 asuransi baru pada seed fresh yang deterministik.
        // Masing-masing diberi mapping produk yang sama seperti guarantor id 1
        // (Jaminan Penawaran & Jaminan Pelaksanaan, Konstruksi & Non Konstruksi)
        // untuk produk id 1 (Surety Bond), supaya langsung bisa dipilih di alur pengajuan.
        foreach ([3, 5, 7, 9, 11, 13] as $guarantorId) {
            $dataMany = array_merge($dataMany, [
                [
                    'guarantor_id' => $guarantorId,
                    'product_id' => 1,
                    'product_type_id' => 1,
                    'no' => 1,
                    'code_product' => '14',
                    'code' => '90.01',
                    'name' => 'Jaminan Penawaran',
                    'job_group' => JobGroup::KONTRUKSI,
                    'job_type' => JobType::UNCONDITIONAL,
                    'full_name' => 'Jaminan Penawaran Konstruksi',
                ],
                [
                    'guarantor_id' => $guarantorId,
                    'product_id' => 1,
                    'product_type_id' => 1,
                    'no' => 1,
                    'code_product' => '14',
                    'code' => '90.02',
                    'name' => 'Jaminan Penawaran',
                    'job_group' => JobGroup::NONKONTRUKSI,
                    'job_type' => JobType::UNCONDITIONAL,
                    'full_name' => 'Jaminan Penawaran Non Konstruksi',
                ],
                [
                    'guarantor_id' => $guarantorId,
                    'product_id' => 1,
                    'product_type_id' => 2,
                    'no' => 4,
                    'code_product' => '14',
                    'code' => '91.01',
                    'name' => 'Jaminan Pelaksanaan',
                    'job_group' => JobGroup::KONTRUKSI,
                    'job_type' => JobType::UNCONDITIONAL,
                    'full_name' => 'Jaminan Pelaksanaan Konstruksi',
                ],
                [
                    'guarantor_id' => $guarantorId,
                    'product_id' => 1,
                    'product_type_id' => 2,
                    'no' => 4,
                    'code_product' => '14',
                    'code' => '91.02',
                    'name' => 'Jaminan Pelaksanaan',
                    'job_group' => JobGroup::NONKONTRUKSI,
                    'job_type' => JobType::UNCONDITIONAL,
                    'full_name' => 'Jaminan Pelaksanaan Non Konstruksi',
                ],
            ]);
        }

        foreach ($dataMany as $data) {
            GuarantorToProductType::query()->create($data);
        }
    }
}
