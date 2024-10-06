<?php

namespace App\Models\Location;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class District extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'regency_id',
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
    public function regency(): BelongsTo
    {
        return $this->belongsTo(Regency::class, 'regency_id');
    }

    public function profile(): HasMany
    {
        return $this->hasMany(Profile::class);
    }
}
