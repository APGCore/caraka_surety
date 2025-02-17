<?php

namespace App\Models\RelatedParties;

use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Submission\Submission;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Principal extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'address' => $this->address,
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

    public function documents(): HasMany
    {
        return $this->hasMany(PrincipalDocument::class);
    }

    public function principalRatios()
    {
        return $this->hasMany(PrincipalRatio::class);
    }
    public function approvedSubmissions()
    {
        return $this->hasMany(Submission::class)->where('status', 'approved');
    }

}
