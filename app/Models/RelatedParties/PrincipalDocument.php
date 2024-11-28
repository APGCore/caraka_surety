<?php

namespace App\Models\RelatedParties;

use App\Models\Document\RequiredDoc;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class PrincipalDocument extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function principal()
    {
        return $this->belongsTo(Principal::class);
    }

    public function requiredDoc()
    {
        return $this->belongsTo(RequiredDoc::class);
    }
}
