<?php

namespace App\Models\Submission;

use App\Models\Guarantor\Blank;
use App\Models\Guarantor\EmployeeLimit;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorProductTypeLimit;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Product\Product;
use App\Models\RelatedParties\Bank;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Submission extends Model
{
    use HasFactory, Searchable, SoftDeletes;

    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    public function scores(): HasMany
    {
        return $this->hasMany(SubmissionScore::class, 'submission_id', 'id');
    }

    public function principal(): BelongsTo
    {
        return $this->belongsTo(Principal::class, 'principal_id', 'id');
    }

    public function bank(): BelongsTo
    {
        return $this->belongsTo(Bank::class, 'bank_id', 'id');
    }

    public function blank(): BelongsToMany
    {
        return self::blanks()->whereHas('blank', function ($query) {
            $query->where('is_broken', false);
        })->first();
    }

    public function blanks(): BelongsToMany
    {
        return $this->belongsToMany(Blank::class, 'submission_blanks', 'blank_id', 'submission_id')->orderBy('id');
    }

    public function obligee(): BelongsTo
    {
        return $this->belongsTo(Obligee::class, 'obligee_id', 'id');
    }

    public function sourceOfFund(): BelongsTo
    {
        return $this->belongsTo(SourceOfFund::class, 'source_of_fund_id', 'id');
    }

    public function guarantor(): BelongsTo
    {
        return $this->belongsTo(Guarantor::class, 'guarantor_id', 'id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function guarantorToProductType(): BelongsTo
    {
        return $this->belongsTo(GuarantorToProductType::class, 'guarantor_to_product_type_id', 'id');
    }

    public function submissionDocs(): HasMany
    {
        return $this->hasMany(SubmissionDoc::class, 'submission_id', 'id');
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(Province::class, 'job_location_province_id');
    }

    // Relasi ke tabel regencies
    public function regency(): BelongsTo
    {
        return $this->belongsTo(Regency::class, 'job_location_regency_id');
    }

    // Relasi ke tabel districts
    public function district(): BelongsTo
    {
        return $this->belongsTo(District::class, 'job_location_district_id');
    }

    public function employeeLimit(): HasMany
    {
        return $this->hasMany(EmployeeLimit::class, 'guarantor_to_product_type_id', 'guarantor_to_product_type_id');
    }

    public function guarantorProductTypeLimit(): HasOne
    {
        return $this->hasOne(GuarantorProductTypeLimit::class, 'guarantor_to_product_type_id', 'guarantor_to_product_type_id');
    }

    public function userChecked(): BelongsTo
    {
        return $this->belongsTo(User::class, 'checked_by', 'id');
    }

    public function userApproved(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by', 'id');
    }

    public function userRejected(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rejected_by', 'id');
    }

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id', 'id');
    }
}
