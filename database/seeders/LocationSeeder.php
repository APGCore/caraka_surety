<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $filePath = database_path('sql/locations.sql');

        if (file_exists($filePath)) {
            $sql = file_get_contents($filePath);
            DB::unprepared($sql);
        }
    }
}
