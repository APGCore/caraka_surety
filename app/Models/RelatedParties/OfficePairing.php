<?php

namespace App\Models\RelatedParties;

use App\Models\Guarantor\Guarantor;
use App\Models\Profile\Profile;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficePairing extends Model
{
    use HasFactory;

    protected $fillable = [
        'office_id',
        'guarantor_id',
    ];

    public function office()
    {
        return $this->belongsTo(Profile::class, 'office_id')->orderBy('name');
    }

    public function guarantor()
    {
        return $this->belongsTo(Guarantor::class, 'guarantor_id')->orderBy('name');
    }
}
