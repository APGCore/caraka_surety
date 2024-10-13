<?php

use App\Models\Guarantor\Guarantor;
use App\Models\Product;
use App\Models\ProductType;
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
        Schema::create('guarantor_to_product_types', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Product::class, 'product_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(ProductType::class, 'product_type_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('code');
            $table->string('name');
            $table->string('job_group');
            $table->string('full_name');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guarantor_to_product_types');
    }
};
