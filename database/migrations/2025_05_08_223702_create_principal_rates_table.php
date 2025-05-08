<?php

use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Profile\Profile;
use App\Models\RelatedParties\Principal;
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
        Schema::create('principal_rates', function (Blueprint $table) {
            $guarantor = new Guarantor;
            $table->id();
            $table->foreignIdFor(Profile::class, 'profile_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId('guarantor_branch_id')->nullable()->references('id')->on($guarantor->getTable())->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignIdFor(GuarantorToProductType::class, 'guarantor_to_product_type_id')->nullable()->constrained()->noActionOnDelete();
            $table->foreignIdFor(Principal::class, 'principal_id')->nullable()->constrained()->noActionOnDelete();
            $table->float('minimum_bill', 5)->default(0);
            $table->float('selling_rate', 5)->default(0);
            $table->float('sales_administration', 5)->default(0);
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
        Schema::dropIfExists('principal_rates');
    }
};
