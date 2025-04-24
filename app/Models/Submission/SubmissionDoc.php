<?php

namespace App\Models\Submission;

use App\Models\Document\DocumentFormat;
use App\Models\Document\RequiredDoc;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class SubmissionDoc extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function toSearchableArray()
    {
        return [
            'id' => $this->getAttribute('id'),
            'name' => $this->getAttribute('name'),
            'description' => $this->getAttribute('description'),
            'status' => $this->getAttribute('status'),
        ];
    }

    public function submission()
    {
        return $this->belongsTo(Submission::class);
    }

    public function requiredDoc()
    {
        return $this->belongsTo(RequiredDoc::class);
    }

    public function documentFormat()
    {
        return $this->belongsTo(DocumentFormat::class, 'document_format_id', 'id');
    }
}
