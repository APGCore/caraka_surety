<?php

namespace Database\Seeders;

use App\Models\Location\Province;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PrincipalSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $principals = [];

        $province = Province::query()->first();
        $regency = $province->regency()->first();
        $district = $regency->district()->first();

        for ($i = 1; $i <= 5; $i++) {
            $principals[] = [
                'headquarter_id' => null,
                'province_id' => $province->id,
                'regency_id' => $regency->id,
                'district_id' => $district->id,
                'village' => 'Dummy Village '.$i,
                'name' => 'Dummy Principal '.$i,
                'address' => '123 Dummy Street '.$i,
                'telephone' => '12345678'.$i,
                'fax' => '12345678'.($i + 1),
                'pic' => 'John Doe '.$i,
                'npwp' => '12345678901234'.$i,
                'nib' => '98765432109876'.$i,
                'siup_siujk' => 'SIUP12345'.$i,
                'head_name' => 'Jane Doe '.$i,
                'director_name' => 'John Smith '.$i,
                'director_position' => 'CEO',
                'director_phone' => '98765432'.$i,
                'commissioner' => 'Robert Brown '.$i,
                'year_established' => '202'.$i,
                'last_deed' => 'Deed-202'.$i,
                'is_approved' => (bool) rand(0, 1),
                'picture' => null,
                'created_by' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('principals')->insert($principals);
    }
}
