<?php

namespace App\Models\Submission;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionCallback extends Model
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
}
