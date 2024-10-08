<?php

namespace Database\Seeders;

use App\Models\Scoring;
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
                "name" => "Surety Bond",
                "min_point" => 60
            ],
            [
                "name" => "Bank Garansi",
                "min_point" => 60
            ],
            [
                "name" => "Custom Bond",
                "min_point" => 60
            ],
            [
                "name" => "General Issurance",
                "min_point" => 60
            ]
        ];

        foreach ($scorings as $scoring) {
            Scoring::create($scoring);
        }
    }
}
