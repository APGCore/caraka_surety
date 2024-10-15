<?php

namespace Database\Seeders;

use App\Models\Scoring\ScoringQuestion;
use Illuminate\Database\Seeder;

class ScoringQuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //

        $scoringQuestions = [
            [
                'scoring_question_category_id' => 1,
                'name' => 'Lama Operasional Usaha',
            ],
            [
                'scoring_question_category_id' => 1,
                'name' => 'Hubungan dan Obligee',
            ],
            [
                'scoring_question_category_id' => 2,
                'name' => 'Pengalaman Terhadap Jenis Pekerjaan',
            ],
            [
                'scoring_question_category_id' => 2,
                'name' => 'Tenaga Ahli Sesuai Proyek',
            ],
            [
                'scoring_question_category_id' => 2,
                'name' => 'Peralatan Mengerjakan Proyek',
            ],
            [
                'scoring_question_category_id' => 3,
                'name' => 'Rasio Likuiditas',
            ],
            [
                'scoring_question_category_id' => 3,
                'name' => 'Rasio Profitabilitas',
            ],
            [
                'scoring_question_category_id' => 3,
                'name' => 'Rasio Solvabilitas',
            ],
            [
                'scoring_question_category_id' => 3,
                'name' => 'Audit Laporan Keuangan',
            ],
            [
                'scoring_question_category_id' => 4,
                'name' => 'Syarat dalam Kontrak',
            ],
            [
                'scoring_question_category_id' => 4,
                'name' => 'Periode Kontrak Proyek',
            ],
            [
                'scoring_question_category_id' => 4,
                'name' => 'Lokasi Proyek terhadap Kantor Pusat',
            ],
            [
                'scoring_question_category_id' => 4,
                'name' => 'Supply Bahan Baku Proyek',
            ],
            [
                'scoring_question_category_id' => 5,
                'name' => 'Bentuk Collateral',
            ],
            [
                'scoring_question_category_id' => 5,
                'name' => 'Nilai Collateral',
            ],
            [
                'scoring_question_category_id' => 5,
                'name' => 'Indemnity Agreement',
            ],
            [
                'scoring_question_category_id' => 5,
                'name' => 'Legalitas Ind. Agreement',
            ],
        ];

        foreach ($scoringQuestions as $question) {
            ScoringQuestion::create($question);
        }
    }
}
