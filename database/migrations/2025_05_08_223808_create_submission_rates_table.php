<?php

use App\Models\Submission\Submission;
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
        Schema::create('submission_rates', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Submission::class, 'submission_id')->constrained()->cascadeOnDelete()->cascadeOnUpdate();
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
        Schema::dropIfExists('submission_rates');
    }
};
