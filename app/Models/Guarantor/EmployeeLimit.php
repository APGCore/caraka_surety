<?php

namespace App\Models\Guarantor;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Laravel\Scout\Searchable;

class EmployeeLimit extends Model
{
    use HasFactory, Searchable;

    protected $guarded = ['id', 'created_at', 'updated_at'];

    public function toSearchableArray(): array
    {
        return [
            'limit' => $this->getAttribute('limit'),
        ];
    }

    public function guarantor(): BelongsTo
    {
        return $this->belongsTo(Guarantor::class);
    }

    public function profile(): BelongsTo
    {
        return $this->belongsTo(Profile::class);
    }

    public function employee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'employee_id');
    }
}
