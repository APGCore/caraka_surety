<?php

namespace App\Models\RelatedParties;

use Illuminate\Database\Eloquent\Model;

class OfficeMonitoring extends Model
{
    protected $table = 'office_monitorings';

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];
}
