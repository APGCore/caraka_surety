<?php

namespace Database\Seeders;

use App\Enums\OfficeType;
use App\Models\Location\Province;
use App\Models\Profile\Profile;
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

        // headquarter
        Profile::create([
            'id' => 1,
            'code' => '14',
            'name' => 'Pusat',
            'province_id' => $province->id,
            'regency_id' => $regency->id,
            'district_id' => $district->id,
            'office_type' => OfficeType::HEADQUARTER->value,
        ]);

        // branch
        Profile::create([
            'id' => 2,
            'code' => '15',
            'name' => 'Lampung',
            'province_id' => $province->id,
            'regency_id' => $regency->id,
            'district_id' => $district->id,
            'office_type' => OfficeType::BRANCH->value,
        ]);

        // agent partner
        Profile::create([
            'id' => 3,
            'code' => '16',
            'name' => 'Agent Partner',
            'province_id' => $province->id,
            'regency_id' => $regency->id,
            'district_id' => $district->id,
            'office_type' => OfficeType::AGENT_PARTNER->value,
        ]);

        // marketing partner
        Profile::create([
            'id' => 4,
            'code' => '17',
            'name' => 'Marketing Partner',
            'province_id' => $province->id,
            'regency_id' => $regency->id,
            'district_id' => $district->id,
            'office_type' => OfficeType::MARKETING_PARTNER->value,
        ]);
    }
}
