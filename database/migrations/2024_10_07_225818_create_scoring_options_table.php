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
        Schema::create('scoring_options', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scoring_question_id')
                ->references('id')->on('scoring_questions')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('name');
            $table->integer('point');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scoring_options');
    }
};
