<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            LocationSeeder::class,
            Roles::class,
            Profiles::class,
            Users::class,
            ProductSeeder::class,
            ProductTypeSeeder::class,
            ProductTypeToProductSeeder::class,
            RequiredDocSeeder::class,
            SourceOfFundSeeder::class,
            ScoringSeeder::class,
            ScoringQuestionCategorySeeder::class,
            ScoringQuestionSeeder::class,
            ScoringOptionSeeder::class,
            PrincipalSeeder::class,
            GuarantorSeeder::class,
            GuarantorToProductTypeSeeder::class,
            ObligeeSeeder::class,
            BankSeeder::class,
            BlankSeeder::class,
            //            ProfileLimitSeeder::class,
            //            EmployeeLimitSeeder::class,
        ]);
    }
}
