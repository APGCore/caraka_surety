<?php

namespace App\Models\Guarantor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Blank extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = ['id', 'created_at', 'updated_at', 'deleted_at'];

    public function toSearchableArray()
    {
        return [
            'number' => $this->number,
        ];
    }

    // Define relationships
    public function guarantor(): BelongsTo
    {
        return $this->belongsTo(Guarantor::class);
    }
}
