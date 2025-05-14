<?php

namespace App\Models\Submission;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class SubmissionRate extends Model
{
    use HasFactory;
    use Searchable;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];
}
