<?php

namespace App\Models;

use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Laravel\Scout\Searchable;

class GuarantorRate extends Model
{
    use HasFactory;
    use Searchable;

    public function guarantor(): HasOne
    {
        return $this->hasOne(Guarantor::class);
    }

    public function guarantorToProductType(): HasOne
    {
        return $this->hasOne(GuarantorToProductType::class);
    }
}
