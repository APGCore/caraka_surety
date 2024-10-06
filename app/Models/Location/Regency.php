<?php

namespace App\Models\Location;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Regency extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'province_id',
        'code',
        'name',
    ];

    public function toSearchableArray()
    {
        return [
            'code' => $this->code,
            'name' => $this->name,
        ];
    }

    // relationship
    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'province_id');
    }

    public function district(): HasMany
    {
        return $this->hasMany(District::class);
    }

    public function profile(): HasMany
    {
        return $this->hasMany(Profile::class);
    }
}
