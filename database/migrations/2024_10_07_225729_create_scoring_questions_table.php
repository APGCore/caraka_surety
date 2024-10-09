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
        Schema::create('scoring_questions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('scoring_question_category_id')
                ->references('id')->on('scoring_question_categories')->cascadeOnDelete()->cascadeOnUpdate();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scoring_questions');
    }
};
