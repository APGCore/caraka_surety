<?php

use App\Models\Product\Product;
use App\Models\Product\ProductType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_type_to_products', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ProductType::class, 'product_type_id')->constrained()
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Product::class, 'product_id')->constrained()
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_type_to_products');
    }
};
