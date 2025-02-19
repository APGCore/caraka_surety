<?php

namespace App\Models;

use App\Models\Guarantor\Guarantor;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class HostToHost extends Model
{
    use HasFactory, Searchable;
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];


    public function toSearchableArray(): array
    {
        return [
            'guarantor_name' => $this->getAttribute('guarantor_name'),
            'guarantor_url_host' => $this->getAttribute('guarantor_url_host'),

        ];
    }

    public function guarantor()
    {
        return $this->belongsTo(Guarantor::class, 'guarantor_id');
    }
}
