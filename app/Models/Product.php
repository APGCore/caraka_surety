<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use HasFactory, SoftDeletes, Searchable;


    protected $fillable = [
        'name',
        'description',
    ];

    public function toSearchableArray()
    {
        return [
            'name' => $this->name,
        ];
    }
}
