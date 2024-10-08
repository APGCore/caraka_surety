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
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->foreignId('province_id')->nullable()
                ->references('id')->on('provinces')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('regency_id')->nullable()
                ->references('id')->on('regencies')->restrictOnDelete()->cascadeOnUpdate();
            $table->foreignId('district_id')->nullable()
                ->references('id')->on('districts')->restrictOnDelete()->cascadeOnUpdate();
            $table->string('village')->nullable();
            $table->string('postal_code')->nullable();
            $table->boolean('is_central')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
