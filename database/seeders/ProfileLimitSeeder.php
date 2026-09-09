<?php

namespace Database\Seeders;

use App\Enums\OfficeType;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Profile\Profile;
use Illuminate\Database\Seeder;

class ProfileLimitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * Dummy: setiap kombinasi produk-asuransi diberi batas kewenangan nilai
     * jaminan per kantor (Pusat lebih besar dari Cabang), untuk semua asuransi.
     */
    public function run(): void
    {
        $profiles = Profile::all();

        GuarantorToProductType::all()->each(function (GuarantorToProductType $guarantorToProductType) use ($profiles) {
            $profiles->each(function (Profile $profile) use ($guarantorToProductType) {
                $isHeadquarter = $profile->office_type === OfficeType::HEADQUARTER->value;

                ProfileLimit::query()->create([
                    'guarantor_id' => $guarantorToProductType->guarantor_id,
                    'guarantor_to_product_type_id' => $guarantorToProductType->id,
                    'profile_id' => $profile->id,
                    'limit' => $isHeadquarter ? 3_000_000_000 : 1_000_000_000,
                    'limit_inherit' => $isHeadquarter ? 1_500_000_000 : 500_000_000,
                ]);
            });
        });
    }
}
