<?php

namespace App\Models\RelatedParties;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class PrincipalDocument extends Model
{
    use HasFactory, Searchable, SoftDeletes;
}
