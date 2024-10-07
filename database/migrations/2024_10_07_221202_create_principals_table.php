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
        Schema::create('principals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('headquarter_id')->nullable();
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
            $table->string('npwp')->nullable();
            $table->string('nib')->nullable();
            $table->string('siup_siujk')->nullable();
            $table->string('head_name')->nullable();
            $table->string('director_name');
            $table->string('director_position')->nullable();
            $table->string('director_phone')->nullable();
            $table->string('commissioner')->nullable();
            $table->string('year_established')->nullable();
            $table->string('last_deed')->nullable();
            $table->boolean('is_approved')->default(false);
            $table->text('picture')->nullable();
            $table->foreignId('created_by')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('principals', function (Blueprint $table) {
            $table->foreign('headquarter_id')->references('id')->on('principals')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('principals');
    }
};
