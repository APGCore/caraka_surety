<?php

namespace App\Models\Submission;

use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\RelatedParties\Bank;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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

    public function scores()
    {
        return $this->hasMany(SubmissionScore::class, 'submission_id', 'id');
    }

    public function principal()
    {
        return $this->belongsTo(Principal::class, 'principal_id', 'id');
    }

    public function bank()
    {
        return $this->belongsTo(Bank::class, 'bank_id', 'id');
    }

    public function obligee()
    {
        return $this->belongsTo(Obligee::class, 'obligee_id', 'id');
    }

    public function sourceOfFund()
    {
        return $this->belongsTo(SourceOfFund::class, 'source_of_fund_id', 'id');
    }

    public function guarantor()
    {
        return $this->belongsTo(Guarantor::class, 'guarantor_id', 'id');
    }

    public function guarantorToProductType()
    {
        return $this->belongsTo(GuarantorToProductType::class, 'guarantor_to_product_type_id', 'id');
    }

    public function submissionDocs()
    {
        return $this->hasMany(SubmissionDoc::class, 'submission_id', 'id');
    }

    public function province()
    {
        return $this->belongsTo(Province::class, 'job_location_province_id');
    }

    // Relasi ke tabel regencies
    public function regency()
    {
        return $this->belongsTo(Regency::class, 'job_location_regency_id');
    }

    // Relasi ke tabel districts
    public function district()
    {
        return $this->belongsTo(District::class, 'job_location_district_id');
    }
}
