<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductTypeToProduct extends Model
{
    use HasFactory;


    protected $fillable = [
        'product_type_id',
        'product_id',
    ];
}
