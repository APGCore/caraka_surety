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
        Schema::table('guarantor_rates', function (Blueprint $table) {
            $table->timestamp('effective_at')->nullable()->after('pph');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('guarantor_rates', function (Blueprint $table) {
            $table->dropColumn('effective_at');
        });
    }
};
