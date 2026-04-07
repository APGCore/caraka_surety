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
        Schema::table('profile_rates', function (Blueprint $table) {
            $table->float('stamp_duty', 5)->default(0)->comment('biaya materai')->after('revised_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profile_rates', function (Blueprint $table) {
            $table->dropColumn('stamp_duty');
        });
    }
};
