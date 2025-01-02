<?php

namespace App\Models;

use App\Models\Guarantor\Guarantor;
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
        return $this->belongsTo(Profile::class, 'office_id');
    }

    public function guarantor()
    {
        return $this->belongsTo(Guarantor::class, 'guarantor_id');
    }
}
