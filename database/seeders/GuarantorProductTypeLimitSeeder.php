<?php

namespace Database\Seeders;

use App\Models\Guarantor\GuarantorProductTypeLimit;
use App\Models\Guarantor\GuarantorToProductType;
use Illuminate\Database\Seeder;

class GuarantorProductTypeLimitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Dummy: setiap kombinasi produk-asuransi (guarantor_to_product_types)
     * diberi batas kewenangan nilai jaminan flat, untuk semua asuransi
     * (termasuk yang sudah ada sebelumnya) supaya tidak ada yang "Belum diatur".
     */
    public function run(): void
    {
        GuarantorToProductType::all()->each(function (GuarantorToProductType $guarantorToProductType) {
            GuarantorProductTypeLimit::query()->create([
                'guarantor_id' => $guarantorToProductType->guarantor_id,
                'guarantor_to_product_type_id' => $guarantorToProductType->id,
                'limit' => 5_000_000_000,
                'limit_inherit' => 2_000_000_000,
            ]);
        });
    }
}
