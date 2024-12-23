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
        Schema::create('guarantor_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(GuarantorToProductType::class, 'guarantor_to_product_type_id')->nullable()->constrained()->noActionOnDelete();
            $table->float('minimum_bill', 5)->default(0);
            $table->float('minimum_payment', 5)->default(0);
            $table->float('selling_rate', 5)->default(0);
            $table->float('pay_rate', 5)->default(0);
            $table->float('sales_administration', 5)->default(0);
            $table->float('payment_administration', 5)->default(0);
            $table->float('stamp_duty', 5)->default(0);
            $table->float('management_fee', 5)->default(0);
            $table->float('minimum_management_fee', 5)->default(0);
            $table->float('broken_rate', 5)->default(0);
            $table->float('revised_rate', 5)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guarantor_rates');
    }
};
