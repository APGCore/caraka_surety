<?php

namespace Database\Seeders;

use App\Models\Product\ProductType;
use Illuminate\Database\Seeder;

class ProductTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $productTypes = [
            [
                'no' => 1,
                'name' => 'Jaminan Penawaran',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 2,
                'name' => 'Jaminan Pelaksanaan',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 3,
                'name' => 'Jaminan Uang Muka',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 4,
                'name' => 'Jaminan Pemeliharaan',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 1,
                'name' => 'KABER',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 2,
                'name' => 'KITE',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 3,
                'name' => 'Impor Sementara',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 1,
                'name' => 'CAR/EAR',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 2,
                'name' => 'Marine Hull',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 3,
                'name' => 'Marine Cargo',
                'description' => 'lorem ipsum',
            ],
            [
                'no' => 4,
                'name' => 'TPL',
                'description' => 'lorem ipsum',
            ],
            // Add more product types as needed
        ];

        foreach ($productTypes as $type) {
            ProductType::query()->create($type);
        }
    }
}
