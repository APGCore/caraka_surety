<?php

namespace Database\Seeders;

use App\Models\Location\Province;
use App\Models\Profile;
use Illuminate\Database\Seeder;

class Profiles extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $province = Province::query()->first();
        $regency = $province->regency()->first();
        $district = $regency->district()->first();

        Profile::create([
            'id' => 1,
            'code' => '14',
            'name' => 'Pusat',
            'province_id' => $province->id,
            'regency_id' => $regency->id,
            'district_id' => $district->id,
            'is_central' => true,
        ]);

        Profile::create([
            'id' => 2,
            'code' => '15',
            'name' => 'Lampung',
            'province_id' => $province->id,
            'regency_id' => $regency->id,
            'district_id' => $district->id,
            'is_central' => false,
        ]);
    }
}
