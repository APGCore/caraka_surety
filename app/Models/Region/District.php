<?php

namespace App\Models\Region;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class District extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'regency_id',
        'code',
        'name',
    ];
}
