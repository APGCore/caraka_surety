<?php

namespace App\Models\Document;

use App\Models\Product\ProductType;
use App\Models\RelatedParties\PrincipalDocument;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequiredDoc extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'isActive' => 'boolean',
    ];

    public function productType()
    {
        return $this->belongsTo(ProductType::class);
    }

    public function principalDocument()
    {
        return $this->hasOne(PrincipalDocument::class, 'required_doc_id');
    }

    public function principalDocuments()
    {
        return $this->hasMany(PrincipalDocument::class, 'required_doc_id');
    }
}
