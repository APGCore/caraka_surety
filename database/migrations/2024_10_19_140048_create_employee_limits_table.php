<?php

use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Profile\Profile;
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
        Schema::create('employee_limits', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Guarantor::class, 'guarantor_id')->constrained()->cascadeOnDelete();
            $table->foreignIdFor(GuarantorToProductType::class, 'guarantor_to_product_type_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(Profile::class, 'profile_id')->constrained()->cascadeOnDelete();
            $table->foreignId('employee_id')->constrained()->on('users')->cascadeOnDelete();
            $table->float('limit');
            $table->float('limit_inherit');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_limits');
    }
};
