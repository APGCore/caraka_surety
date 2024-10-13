<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class ScoringQuestion extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
        ];
    }

    // Define relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(ScoringQuestionCategory::class, 'scoring_question_category_id');
    }

    public function options(): HasMany
    {
        return $this->hasMany(ScoringOption::class);
    }
}
