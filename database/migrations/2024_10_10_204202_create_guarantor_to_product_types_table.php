<?php

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
            $table->foreignId('guarantor_id')->references('id')->on('guarantors')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('product_type_id')->references('id')->on('product_types')
                ->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('code');
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
