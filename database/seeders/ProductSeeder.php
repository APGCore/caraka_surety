<?php

namespace Database\Seeders;

use App\Models\Product\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $products = [
            [
                'name' => 'Surety Bond',
                'description' => 'lorem ipsum',
            ],
            [
                'name' => 'Bank Garansi',
                'description' => 'lorem ipsum',
            ],
            [
                'name' => 'Custom Bond',
                'description' => 'lorem ipsum',
            ],
            [
                'name' => 'General Issurance',
                'description' => 'lorem ipsum',
            ],
            // Add more product types as needed
        ];

        foreach ($products as $product) {
            Product::query()->create($product);
        }
    }
}
