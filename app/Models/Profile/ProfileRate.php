<?php

namespace App\Models\Profile;

use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ProfileRate extends Model
{
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class, 'profile_id');
    }

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
