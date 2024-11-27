<?php

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
        Schema::create('principal_ratios', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Principal::class, 'principal_id')->constrained()->cascadeOnDelete();
            $table->float('current_assets');
            $table->float('current_debt');
            $table->float('total_debt');
            $table->float('total_assets');
            $table->float('revenue');
            $table->float('net_income');
            $table->float('liquidity_ratios');
            $table->float('solvency_ratios');
            $table->float('profitability_ratios');
            $table->integer('year');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('principal_ratios');
    }
};
