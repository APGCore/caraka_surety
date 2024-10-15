<?php

namespace Database\Seeders;

use App\Models\Scoring\Scoring;
use Illuminate\Database\Seeder;

class ScoringSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $scorings = [
            [
                'name' => 'Analisis Skoring',
                'min_point' => 60,
            ],
        ];

        foreach ($scorings as $scoring) {
            Scoring::create($scoring);
        }
    }
}
