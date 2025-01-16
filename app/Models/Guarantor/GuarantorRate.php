<?php

namespace App\Models\Guarantor;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Scout\Searchable;

class GuarantorRate extends Model
{
    use HasFactory;
    use Searchable;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function guarantor(): HasOne
    {
        return $this->hasOne(Guarantor::class);
    }

    public function guarantorBranch(): HasOne
    {
        return $this->hasOne(Guarantor::class);
    }

    public function guarantorToProductType(): HasOne
    {
        return $this->hasOne(GuarantorToProductType::class);
    }
}
