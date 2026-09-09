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
        if (! Schema::hasColumn('document_formats', 'deleted_at')) {
            Schema::table('document_formats', function (Blueprint $table) {
                $table->softDeletes();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('document_formats', 'deleted_at')) {
            Schema::table('document_formats', function (Blueprint $table) {
                $table->dropSoftDeletes();
            });
        }
    }
};
