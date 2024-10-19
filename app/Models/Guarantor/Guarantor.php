<?php

namespace App\Models\Guarantor;

use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Product\ProductType;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
            'pic' => $this->getAttribute('pic'),
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

    public function guarantorToProductTypes(): HasMany
    {
        return $this->hasMany(GuarantorToProductType::class, 'guarantor_id');
    }

    public function productType(): BelongsToMany
    {
        return $this->belongsToMany(ProductType::class, 'guarantor_to_product_types', 'guarantor_id', 'product_type_id')->withPivot('code');
    }

    public function headquarter(): BelongsTo
    {
        return $this->belongsTo(Guarantor::class, 'headquarter_id');
    }

    public function branchGuarantors(): HasMany
    {
        return $this->hasMany(Guarantor::class, 'headquarter_id');
    }

    public function profileLimit(): BelongsToMany
    {
        return $this->belongsToMany(Profile::class, ProfileLimit::class, 'guarantor_id', 'profile_id')->withPivot('limit');
    }
}
