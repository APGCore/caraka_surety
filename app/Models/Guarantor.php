<?php

namespace App\Models;

use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Guarantor extends Model
{
    use HasFactory,Searchable, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->getAttribute('name'),
            'telephone' => $this->getAttribute('telephone'),
        ];
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class);
    }

    public function regency(): BelongsTo
    {
        return $this->belongsTo(Regency::class);
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class);
    }
}
