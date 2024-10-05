<?php

namespace App\Models;

use App\Models\Region\District;
use App\Models\Region\Province;
use App\Models\Region\Regency;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Profile extends Model
{
    use HasFactory;
    use Searchable;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'postal_code',
        'province_id',
        'regency_id',
        'district_id',
    ];

    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'email' => $this->email,
        ];
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }

    public function regency()
    {
        return $this->belongsTo(Regency::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }
}
