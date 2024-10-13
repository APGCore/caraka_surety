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
        Schema::create('banks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('province_id')->nullable()
                ->references('id')->on('provinces')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('regency_id')->nullable()
                ->references('id')->on('regencies')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('district_id')->nullable()
                ->references('id')->on('districts')->restrictOnDelete()->cascadeOnUpdate();
            $table->string('village')->nullable();
            $table->string('name');
            $table->string('address');
            $table->string('telephone');
            $table->string('fax')->nullable();
            $table->string('pic')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('banks');
    }
};
