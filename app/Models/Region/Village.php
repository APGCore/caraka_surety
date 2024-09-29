<?php

namespace App\Models\Region;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Village extends Model
{
    use HasFactory;
    use Searchable;
    use SoftDeletes;

    public $incrementing = false;

    protected $fillable = [
        'id',
        'district_id',
        'name',
    ];
}
