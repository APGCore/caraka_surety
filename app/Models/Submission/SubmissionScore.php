<?php

namespace App\Models\Submission;

use App\Models\Scoring\Scoring;
use App\Models\Scoring\ScoringOption;
use App\Models\Scoring\ScoringQuestion;
use App\Models\Scoring\ScoringQuestionCategory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class SubmissionScore extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function scoring()
    {
        return $this->belongsTo(Scoring::class);
    }

    public function scoringQuestionCategory()
    {
        return $this->belongsTo(ScoringQuestionCategory::class);
    }

    public function scoringQuestion()
    {
        return $this->belongsTo(ScoringQuestion::class);
    }

    public function scoringOption()
    {
        return $this->belongsTo(ScoringOption::class);
    }
}
