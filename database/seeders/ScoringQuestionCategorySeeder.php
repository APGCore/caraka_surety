<?php

namespace Database\Seeders;

use App\Models\ScoringQuestionCategory;
use Illuminate\Database\Seeder;

class ScoringQuestionCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $scoringQuestionCategory = [
            [
                'scoring_id' => 1,
                'name' => 'Character',
                'max_point' => 30,
            ],
            [
                'scoring_id' => 1,
                'name' => 'Capacity',
                'max_point' => 20,
            ],
            [
                'scoring_id' => 1,
                'name' => 'Capital',
                'max_point' => 20,
            ],
            [
                'scoring_id' => 1,
                'name' => 'Condition',
                'max_point' => 17,
            ],
            [
                'scoring_id' => 1,
                'name' => 'Collateral',
                'max_point' => 13,
            ],

        ];

        foreach ($scoringQuestionCategory as $category) {
            ScoringQuestionCategory::create($category);
        }
    }
}
