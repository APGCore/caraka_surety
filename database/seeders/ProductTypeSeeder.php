<?php

namespace Database\Seeders;

use App\Models\ProductType;
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
                'name' => 'Jaminan Penawaran',
                'description' => 'lorem ipsum',
            ],
            [
                'name' => 'Jaminan Pelaksanaan',
                'description' => 'lorem ipsum',
            ],
            [
                'name' => 'Jaminan Uang Muka',
                'description' => 'lorem ipsum',
            ],
            [
                'name' => 'Jaminan Pemeliharaan',
                'description' => 'lorem ipsum',
            ],
            // Add more product types as needed
        ];

        foreach ($productTypes as $type) {
            ProductType::create($type);
        }
    }
}
