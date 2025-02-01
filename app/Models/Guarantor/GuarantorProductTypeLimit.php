<?php

namespace App\Models\Guarantor;

use App\Models\Profile\Profile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuarantorProductTypeLimit extends Model
{
    use HasFactory;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    // guarantor
    public function guarantor(): BelongsTo
    {
        return $this->belongsTo(Guarantor::class);
    }

    // profile
    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    // guarantorToProductType
    public function guarantorToProductType(): BelongsTo
    {
        return $this->belongsTo(GuarantorToProductType::class);
    }
}
