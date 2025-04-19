<?php

namespace App\Models\Product;

use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class ProductType extends Model
{
  use HasFactory, Searchable, SoftDeletes;

  protected $guarded = [
    'id',
    'updated_at',
    'deleted_at',
  ];

  public function toSearchableArray()
  {
    return [
      'name' => $this->name,
    ];
  }

  public function product(): BelongsToMany
  {
    $productTypeToProduk = new ProductTypeToProduct;

    return $this->belongsToMany(Product::class, $productTypeToProduk->getTable(), 'product_type_id', 'product_id');
  }

  public function guarantor(): BelongsToMany
  {
    $guarantorToProductType = new GuarantorToProductType;

    return $this->belongsToMany(Guarantor::class, $guarantorToProductType->getTable(), 'product_type_id', 'guarantor_id')->withPivot([
      'code',
      'name',
      'job_group',
      'full_name',
    ]);
  }

  public function guarantorToProductType(): HasMany
  {
    return $this->hasMany(GuarantorToProductType::class, 'product_type_id');
  }
}
