<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class ScoringOption extends Model
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
    public function question(): BelongsTo
    {
        return $this->belongsTo(ScoringQuestion::class);
    }
}
