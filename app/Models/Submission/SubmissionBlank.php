<?php

namespace App\Models\Submission;

use App\Models\Guarantor\Blank;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionBlank extends Model
{
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function submission(): BelongsTo
    {
        return $this->belongsTo(Submission::class);
    }

    public function blank(): BelongsTo
    {
        return $this->belongsTo(Blank::class);
    }
}
