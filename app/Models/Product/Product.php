<?php

namespace App\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
        ];
    }

    public function productType(): BelongsToMany
    {
        $productTypeToProduk = new ProductTypeToProduct;

        return $this->belongsToMany(ProductType::class, $productTypeToProduk->getTable(), 'product_id', 'product_type_id');
    }

    public function productTypeToProduct(): HasMany
    {
        return $this->hasMany(ProductTypeToProduct::class);
    }
}
