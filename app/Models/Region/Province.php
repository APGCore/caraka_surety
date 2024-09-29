<?php

namespace App\Models\Region;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Province extends Model
{
    use HasFactory;
    use Searchable;

    protected $fillable = [
        'code',
        'name',
    ];
}
