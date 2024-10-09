<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScoringQuestion extends Model
{
    use HasFactory, SoftDeletes;

    // Define relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(ScoringQuestionCategory::class);
    }

    public function options(): HasMany
    {
        return $this->hasMany(ScoringOption::class);
    }
}
