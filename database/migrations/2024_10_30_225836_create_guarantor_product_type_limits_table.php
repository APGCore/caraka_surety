<?php

use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
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
        $guarantorToProductType = new GuarantorToProductType;
        Schema::create('guarantor_product_type_limits', function (Blueprint $table) use ($guarantorToProductType) {
            $table->id();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->cascadeOnDelete();
            $table->unsignedBigInteger('guarantor_to_product_type_id')->nullable();
            $table->float('limit');
            $table->float('limit_inherit');
            $table->timestamps();

            $table->foreign('guarantor_to_product_type_id', 'guarantor_to_product_type_fk')
                ->references('id')->on($guarantorToProductType->getTable())->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guarantor_product_type_limits');
    }
};
