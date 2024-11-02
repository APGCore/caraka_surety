<?php

namespace App\Http\Requests\Submission;

use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Product\Product;
use App\Models\RelatedParties\Bank;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use App\Models\RequiredDoc;
use App\Models\Scoring\Scoring;
use App\Models\Scoring\ScoringOption;
use App\Models\Scoring\ScoringQuestion;
use App\Models\Scoring\ScoringQuestionCategory;
use App\Models\Submission\SourceOfFund;
use Illuminate\Foundation\Http\FormRequest;

class StoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // principals
            'principal' => ['required'],
            'principal.id' => ['nullable', 'exists:'.Principal::class.',id,deleted_at,NULL'],
            'principal.province_id' => ['required', 'exists:'.Province::class.',id,deleted_at,NULL'],
            'principal.regency_id' => ['required', 'exists:'.Regency::class.',id,deleted_at,NULL'],
            'principal.district_id' => ['required', 'exists:'.District::class.',id,deleted_at,NULL'],
            'principal.village' => ['nullable', 'string', 'max:255'],
            'principal.name' => ['required', 'string', 'max:255'], // nama perusahaan
            'principal.address' => ['required', 'string', 'max:255'], // alamat perusahaan
            'principal.telephone' => ['required', 'string', 'max:255'], // telepon perusahaan
            'principal.fax' => ['nullable', 'string', 'max:255'], // fax perusahaan
            'principal.npwp' => ['required', 'string', 'max:255'], // npwp perusahaan
            'principal.nib' => ['nullable', 'string', 'max:255'], // nib perusahaan
            'principal.siup_siujk' => ['nullable', 'string', 'max:255'], // siup/siujk perusahaan
            'principal.head_name' => ['nullable', 'string', 'max:255'], // nama kepala perusahaan
            'principal.director_name' => ['required', 'string', 'max:255'], // nama direktur perusahaan
            'principal.director_position' => ['required', 'string', 'max:255'], // jabatan direktur perusahaan
            'principal.director_phone' => ['required', 'string', 'max:255'], // telepon direktur perusahaan
            'principal.commissioner' => ['nullable', 'string', 'max:255'], // komisaris perusahaan
            'principal.year_established' => ['required', 'string', 'max:255'], // tahun berdiri perusahaan
            'principal.last_deed' => ['nullable', 'string', 'max:255'], // akta terakhir perusahaan
            // principal documents
            'principal.documents' => ['required', 'array'],
            'principal.documents.*.required_doc_id' => ['required', 'exists:'.RequiredDoc::class.',id,deleted_at,NULL'], // id dokumen wajib
            'principal.documents.*.required_doc_name' => ['required', 'exists:'.RequiredDoc::class.',name,deleted_at,NULL'], // nama dokumen wajib
            'principal.documents.*.file' => ['required', 'file', 'mimes:pdf', 'max:2048'], // file dokumen wajib

            // submission
            'submission' => ['required'],
            'submission.guarantor_id' => ['required', 'exists:'.Guarantor::class.',id,deleted_at,NULL'], // id penjamin
            'submission.product_id' => ['required', 'exists:'.Product::class.',id,deleted_at,NULL'], // id produk
            'submission.guarantor_to_product_type_id' => ['required', 'exists:'.GuarantorToProductType::class.',id,deleted_at,NULL'], // id penjamin ke tipe produk
            'submission.obligee_id' => ['required', 'exists:'.Obligee::class.',id,deleted_at,NULL'], // id obligee
            'submission.bank_id' => ['nullable', 'exists:'.Bank::class.',id,deleted_at,NULL'], // id bank
            'submission.contract_doc_name' => ['required', 'string', 'max:255'], // nama dokumen kontrak
            'submission.contract_doc_number' => ['required', 'string', 'max:255'], // nomor dokumen kontrak
            'submission.contract_doc_date' => ['required', 'date'], // tanggal dokumen kontrak
            'submission.contract_value' => ['required', 'numeric'], // nilai kontrak
            'submission.guarantee_value' => ['required', 'numeric'], // nilai jaminan
            'submission.time_period' => ['required', 'numeric'], // jangka waktu (165 Hari)
            'submission.start_date' => ['required', 'date'], // tanggal mulai
            'submission.end_date' => ['nullable', 'date'], // tanggal berakhir
            'submission.job_location_province_id' => ['required', 'exists:'.Province::class.',id,deleted_at,NULL'], // id provinsi lokasi pekerjaan
            'submission.job_location_regency_id' => ['required', 'exists:'.Regency::class.',id,deleted_at,NULL'], // id kabupaten/kota lokasi pekerjaan
            'submission.job_location_district_id' => ['required', 'exists:'.District::class.',id,deleted_at,NULL'], // id kecamatan lokasi pekerjaan
            'submission.job_location_village' => ['required', 'string', 'max:255'], // desa lokasi pekerjaan
            'submission.source_of_fund_id' => ['required', 'exists:'.SourceOfFund::class.',id,deleted_at,NULL'], // id sumber dana
            'submission.note' => ['nullable', 'string'], // catatan

            // scoring
            'scoring' => ['required'],
            'scoring.id' => ['required', 'exists:'.Scoring::class.',id,deleted_at,NULL'], // id scoring
            'scoring.note' => ['nullable', 'string'], // catatan
            'scoring.min_point' => ['nullable', 'numeric'], // minimal point
            'scoring.scores' => ['required', 'array'], // skor
            'scoring.scores.*.scoring_question_category_id' => ['required', ScoringQuestionCategory::class.',id,deleted_at,NULL'], // id kategori pertanyaan skor
            'scoring.scores.*.scoring_question_id' => ['required', ScoringQuestion::class.',id,deleted_at,NULL'], // id pertanyaan skor
            'scoring.scores.*.scoring_option_id' => ['required', 'exists:'.ScoringOption::class.',id,deleted_at,NULL'], // id opsi skor
            'scoring.scores.*.point' => ['required', 'numeric'], // point skor
        ];
    }
}
