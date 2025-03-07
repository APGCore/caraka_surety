<?php

namespace App\Models\Document;

use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product\Product;
use App\Models\Product\ProductType;
use App\Models\Submission\Submission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class DocumentFormat extends Model
{
    use Searchable;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
        ];
    }

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function guarantorToProductType(): BelongsTo
    {
        return $this->belongsTo(GuarantorToProductType::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    public function productType(): BelongsTo
    {
        return $this->belongsTo(ProductType::class);
    }
}
