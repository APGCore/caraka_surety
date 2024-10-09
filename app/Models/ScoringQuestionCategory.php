<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ScoringQuestionCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    // Define relationships
    public function scoring(): BelongsTo
    {
        return $this->belongsTo(Scoring::class);
    }

    public function questions(): HasMany
    {
        return $this->hasMany(ScoringQuestion::class);
    }
}
