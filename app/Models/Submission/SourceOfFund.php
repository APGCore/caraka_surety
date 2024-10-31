<?php

namespace App\Models\Submission;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class SourceOfFund extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $fillable = [
        'name',
    ];

    public function toSearchableArray()
    {
        return $this->only('name');
    }
}
