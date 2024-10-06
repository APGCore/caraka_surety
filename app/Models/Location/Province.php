<?php

namespace App\Models\Location;

use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Scout\Searchable;

class Province extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'code',
        'name',
    ];

    // is relation
    public function regency(): HasMany
    {
        return $this->hasMany(Regency::class);
    }

    public function profile(): HasMany
    {
        return $this->hasMany(Profile::class);
    }
}
