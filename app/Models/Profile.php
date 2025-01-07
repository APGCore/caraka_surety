<?php

namespace App\Models;

use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Profile extends Model
{
    use HasFactory;
    use Searchable;
    use SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
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

    public function guarantorLimit(): BelongsToMany
    {
        return $this->belongsToMany(Guarantor::class, ProfileLimit::class, 'profile_id', 'guarantor_id')->withPivot('limit');
    }

    public function profileLimit(): HasMany
    {
        return $this->hasMany(ProfileLimit::class, 'profile_id');
    }

    public function guarantors(): BelongsToMany
    {
        return $this->belongsToMany(Guarantor::class, OfficePairing::class, 'office_id', 'guarantor_id');
    }
}
