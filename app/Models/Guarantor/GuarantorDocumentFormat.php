<?php

namespace App\Models\Guarantor;

use App\Models\Submission\Submission;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class GuarantorDocumentFormat extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function guarantorToProductType(): BelongsTo
    {
        return $this->belongsTo(GuarantorToProductType::class);
    }
}
