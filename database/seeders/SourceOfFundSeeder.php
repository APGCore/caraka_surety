<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SourceOfFundSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['name' => 'APBN'],
            ['name' => 'APBD'],
            ['name' => 'BUMN'],
            ['name' => 'BUMD'],
            ['name' => 'SWASTA'],
        ];

        foreach ($data as $item) {
            \App\Models\Submission\SourceOfFund::create($item);
        }
    }
}
