<?php

namespace App\Models\Guarantor;

use App\Models\Document\DocumentFormat;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Product\Product;
use App\Models\Product\ProductType;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Guarantor extends Model
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
            'pic' => $this->getAttribute('pic'),
            'code' => $this->getAttribute('code'),
            'name' => $this->getAttribute('name'),
            'telephone' => $this->getAttribute('telephone'),
        ];
    }

    public function head(): BelongsTo
    {
        return $this->belongsTo(Guarantor::class, 'headquarter_id');
    }

    public function branch(): HasMany
    {
        return $this->hasMany(Guarantor::class, 'headquarter_id');
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
        return $this->hasMany(GuarantorToProductType::class, 'guarantor_id')->orderBy('id');
    }

    public function profileLimit(): BelongsToMany
    {
        return $this->belongsToMany(Profile::class, ProfileLimit::class, 'guarantor_id', 'profile_id')->withPivot('limit');
    }

    protected array $pivot = [
        'code',
        'name',
        'job_group',
        'full_name',
    ];

    public function product(): BelongsToMany
    {
        $guarantorToProductType = new GuarantorToProductType;

        return $this->belongsToMany(Product::class, $guarantorToProductType->getTable(), 'guarantor_id', 'product_id')->withPivot($this->pivot);
    }

    public function productType(): BelongsToMany
    {
        $guarantorToProductType = new GuarantorToProductType;

        return $this->belongsToMany(ProductType::class, $guarantorToProductType->getTable(), 'guarantor_id', 'product_type_id')->withPivot($this->pivot);
    }

    public function pattern(): HasOne
    {
        return $this->hasOne(Pattern::class);
    }

    public function documentFormats(): HasMany
    {
        return $this->hasMany(DocumentFormat::class);
    }

    public function guarantorRate(): HasMany
    {
        return $this->hasMany(GuarantorRate::class);
    }
}
