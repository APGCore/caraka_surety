<?php

namespace App\Models\Guarantor;

use App\Models\Product\Product;
use App\Models\Product\ProductType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class GuarantorToProductType extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function toSearchableArray(): array
    {
        return [
            'code' => $this->getAttribute('code'),
            'name' => $this->getAttribute('name'),
            'job_group' => $this->getAttribute('job_group'),
            'full_name' => $this->getAttribute('full_name'),
            'minimum_bill' => $this->getAttribute('minimum_bill'),
            'minimum_payment' => $this->getAttribute('minimum_payment'),
            'selling_rate' => $this->getAttribute('selling_rate'),
            'pay_rate' => $this->getAttribute('pay_rate'),
            'sales_administration' => $this->getAttribute('sales_administration'),
            'payment_administration' => $this->getAttribute('payment_administration'),
            'stamp_duty' => $this->getAttribute('stamp_duty'),
            'management_fee' => $this->getAttribute('management_fee'),
            'minimum_management_fee' => $this->getAttribute('minimum_management_fee'),
            'broken_rate' => $this->getAttribute('broken_rate'),
            'revised_rate float' => $this->getAttribute('revised_rate'),
        ];
    }

    public function guarantor(): BelongsTo
    {
        return $this->belongsTo(Guarantor::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function productType(): BelongsTo
    {
        return $this->belongsTo(ProductType::class);
    }
}
