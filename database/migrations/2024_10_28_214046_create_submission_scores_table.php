<?php

use App\Models\Scoring\Scoring;
use App\Models\Scoring\ScoringOption;
use App\Models\Scoring\ScoringQuestion;
use App\Models\Scoring\ScoringQuestionCategory;
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
        Schema::create('submission_scores', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(Submission::class, 'submission_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(Scoring::class, 'scoring_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(ScoringQuestionCategory::class, 'scoring_question_category_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(ScoringQuestion::class, 'scoring_question_id')->constrained()->noActionOnDelete();
            $table->foreignIdFor(ScoringOption::class, 'scoring_option_id')->constrained()->noActionOnDelete();
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
        Schema::dropIfExists('submission_scores');
    }
};
