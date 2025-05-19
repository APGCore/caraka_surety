<?php

namespace App\Models\Guarantor;

use App\Models\RelatedParties\Bank;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuarantorPairing extends Model
{
    protected $fillable = [
        'guarantor_id',
        'bank_id',
    ];

    public function guarantor(): BelongsTo
    {
        return $this->belongsTo(Guarantor::class, 'guarantor_id')->orderBy('name');
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class, 'bank_id')->orderBy('name');
    }
}
