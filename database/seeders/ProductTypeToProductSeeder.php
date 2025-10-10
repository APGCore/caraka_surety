<?php

namespace Database\Seeders;

use App\Models\Product\ProductTypeToProduct;
use Illuminate\Database\Seeder;

class ProductTypeToProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $productTypeToProducts = [
            [
                'product_id' => 1,
                'product_type_id' => 1,
            ],
            [
                'product_id' => 1,
                'product_type_id' => 2,
            ],
            [
                'product_id' => 1,
                'product_type_id' => 3,
            ],
            [
                'product_id' => 1,
                'product_type_id' => 4,
            ],
            [
                'product_id' => 2,
                'product_type_id' => 1,
            ],
            [
                'product_id' => 2,
                'product_type_id' => 2,
            ],
            [
                'product_id' => 2,
                'product_type_id' => 3,
            ],
            [
                'product_id' => 2,
                'product_type_id' => 4,
            ],
            [
                'product_id' => 3,
                'product_type_id' => 5,
            ],
            [
                'product_id' => 3,
                'product_type_id' => 6,
            ],
            [
                'product_id' => 3,
                'product_type_id' => 7,
            ],
            [
                'product_id' => 4,
                'product_type_id' => 8,
            ],
            [
                'product_id' => 4,
                'product_type_id' => 9,
            ],
            [
                'product_id' => 4,
                'product_type_id' => 10,
            ],
            [
                'product_id' => 4,
                'product_type_id' => 11,
            ],
        ];

        foreach ($productTypeToProducts as $productTypeToProduct) {
            ProductTypeToProduct::query()->create($productTypeToProduct);
        }
    }
}
