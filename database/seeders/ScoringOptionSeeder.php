<?php

namespace Database\Seeders;

use App\Models\Scoring\ScoringOption;
use Illuminate\Database\Seeder;

class ScoringOptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $scoringOptions = [
            [
                'scoring_question_id' => 1,
                'name' => '> 5 thn',
                'point' => 15,
            ],
            [
                'scoring_question_id' => 1,
                'name' => '>= 3 thn s/d 5 thn',
                'point' => 10,
            ],
            [
                'scoring_question_id' => 1,
                'name' => '< thn',
                'point' => 5,
            ],
            [
                'scoring_question_id' => 2,
                'name' => 'Sangat Baik',
                'point' => 15,
            ],
            [
                'scoring_question_id' => 2,
                'name' => 'Baik',
                'point' => 10,
            ],
            [
                'scoring_question_id' => 2,
                'name' => 'Cukup',
                'point' => 5,
            ],
            [
                'scoring_question_id' => 3,
                'name' => '> 4 Proyek yang sama',
                'point' => 6,
            ],
            [
                'scoring_question_id' => 3,
                'name' => '> 1 < 4 Proyek yang Sama',
                'point' => 3,
            ],
            [
                'scoring_question_id' => 3,
                'name' => 'Belum Pernah',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 4,
                'name' => '> 5 Tenaga Ahli',
                'point' => 6,
            ],
            [
                'scoring_question_id' => 4,
                'name' => '> 2 < 5 Tenaga Ahli',
                'point' => 3,
            ],
            [
                'scoring_question_id' => 4,
                'name' => '1 Tenaga Ahli',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 5,
                'name' => 'Cukup, Milik Sendiri',
                'point' => 8,
            ],
            [
                'scoring_question_id' => 5,
                'name' => 'Sewa Rutin dengan Supplier',
                'point' => 4,
            ],
            [
                'scoring_question_id' => 5,
                'name' => 'Rencana Sewa',
                'point' => 2,
            ],
            [
                'scoring_question_id' => 6,
                'name' => '> 1',
                'point' => 6,
            ],
            [
                'scoring_question_id' => 6,
                'name' => '= 1',
                'point' => 4,
            ],
            [
                'scoring_question_id' => 6,
                'name' => '< 1',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 7,
                'name' => '> 20%',
                'point' => 6,
            ],
            [
                'scoring_question_id' => 7,
                'name' => '= 10 - 20%',
                'point' => 4,
            ],
            [
                'scoring_question_id' => 7,
                'name' => '< 10%',
                'point' => 2,
            ],
            [
                'scoring_question_id' => 8,
                'name' => '< 1',
                'point' => 4,
            ],
            [
                'scoring_question_id' => 8,
                'name' => '= 1',
                'point' => 0,
            ],
            [
                'scoring_question_id' => 8,
                'name' => '> 1',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 9,
                'name' => 'Auditor Terdaftar',
                'point' => 4,
            ],
            [
                'scoring_question_id' => 9,
                'name' => 'Auditor Intern',
                'point' => 0,
            ],
            [
                'scoring_question_id' => 9,
                'name' => 'Non Audit',
                'point' => 0,
            ],
            [
                'scoring_question_id' => 10,
                'name' => 'Mudah dikerjakan',
                'point' => 6,
            ],
            [
                'scoring_question_id' => 10,
                'name' => 'Masih dapat Dikerjakan',
                'point' => 4,
            ],
            [
                'scoring_question_id' => 10,
                'name' => 'Sulit dikerjakan',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 11,
                'name' => '< 1 Tahun',
                'point' => 3,
            ],
            [
                'scoring_question_id' => 11,
                'name' => 's/d 1 Tahun',
                'point' => 2,
            ],
            [
                'scoring_question_id' => 11,
                'name' => '> 1 Tahun',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 12,
                'name' => 'Propinsi yang sama',
                'point' => 3,
            ],
            [
                'scoring_question_id' => 12,
                'name' => 'Propinsi Lain',
                'point' => 2,
            ],
            [
                'scoring_question_id' => 12,
                'name' => 'Luar Negeri',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 13,
                'name' => 'dari Propinsi Sendiri',
                'point' => 5,
            ],
            [
                'scoring_question_id' => 13,
                'name' => 'dari Propinsi Terdekat',
                'point' => 3,
            ],
            [
                'scoring_question_id' => 13,
                'name' => 'dari Propinsi Lain',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 14,
                'name' => 'Cash Collateral',
                'point' => 4,
            ],
            [
                'scoring_question_id' => 14,
                'name' => 'Assets Collateral',
                'point' => 2,
            ],
            [
                'scoring_question_id' => 14,
                'name' => 'Non Collateral',
                'point' => 0,
            ],
            [
                'scoring_question_id' => 15,
                'name' => '> 50% Penal Sum',
                'point' => 3,
            ],
            [
                'scoring_question_id' => 15,
                'name' => '> 10% < 50%',
                'point' => 2,
            ],
            [
                'scoring_question_id' => 15,
                'name' => 's/d 10%',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 16,
                'name' => 'Sign By Dir dan PS',
                'point' => 3,
            ],
            [
                'scoring_question_id' => 16,
                'name' => 'Sign By Dir dan Kom',
                'point' => 2,
            ],
            [
                'scoring_question_id' => 16,
                'name' => 'Sign By Direktur',
                'point' => 1,
            ],
            [
                'scoring_question_id' => 17,
                'name' => 'Dibuat Notaris',
                'point' => 3,
            ],
            [
                'scoring_question_id' => 17,
                'name' => 'Didaftar ke Notaris',
                'point' => 2,
            ],
            [
                'scoring_question_id' => 17,
                'name' => 'Tanpa Notaris',
                'point' => 0,
            ],
        ];

        foreach ($scoringOptions as $scoringOption) {
            ScoringOption::query()->create($scoringOption);
        }
    }
}
