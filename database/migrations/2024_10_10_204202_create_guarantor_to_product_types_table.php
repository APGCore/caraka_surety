<?php

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Models\Guarantor\Guarantor;
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
        Schema::create('guarantor_to_product_types', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Product::class, 'product_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(ProductType::class, 'product_type_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->integer('no');
            $table->string('code_product');
            $table->string('code');
            $table->string('name');
            $table->string('full_name');
            $table->enum('job_group', JobGroup::getValues())->nullable();
            $table->enum('job_type', JobType::getValues())->nullable();
            $table->timestamps();
            $table->softDeletes();
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
