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
            [
                'guarantor_id' => 3,
                'product_id' => 1,
                'product_type_id' => 1,
                'no' => 1,
                'code_product' => '14',
                'code' => '01',
                'name' => 'Jaminan Penawaran',
                'job_group' => JobGroup::KONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Penawaran Konstruksi',
            ],
            [
                'guarantor_id' => 3,
                'product_id' => 1,
                'product_type_id' => 2,
                'no' => 2,
                'code_product' => '14',
                'code' => '02',
                'name' => 'Jaminan Pelaksanaan',
                'job_group' => JobGroup::KONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Pelaksanaan Konstruksi',
            ],
            [
                'guarantor_id' => 3,
                'product_id' => 1,
                'product_type_id' => 3,
                'no' => 3,
                'code_product' => '14',
                'code' => '03',
                'name' => 'Jaminan Uang Muka',
                'job_group' => JobGroup::KONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Uang Muka Konstruksi',
            ],
            [
                'guarantor_id' => 3,
                'product_id' => 1,
                'product_type_id' => 4,
                'no' => 4,
                'code_product' => '14',
                'code' => '04',
                'name' => 'Jaminan Pemeliharaan',
                'job_group' => JobGroup::KONTRUKSI,
                'job_type' => JobType::UNCONDITIONAL,
                'full_name' => 'Jaminan Pemeliharaan Konstruksi',
            ],
        ];

        foreach ($dataMany as $data) {
            GuarantorToProductType::query()->create($data);
        }
    }
}
