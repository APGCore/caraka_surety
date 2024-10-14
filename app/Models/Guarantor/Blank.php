<?php

namespace App\Models\Guarantor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Blank extends Model
{
    use HasFactory;

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
