<?php

namespace Database\Seeders;

use App\Models\Submission\SourceOfFund;
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
            SourceOfFund::query()->create($item);
        }
    }
}
