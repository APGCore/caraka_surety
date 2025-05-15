<?php

namespace App\Http\Requests\Submission;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Product\Product;
use App\Models\Product\ProductType;
use App\Models\RelatedParties\Bank;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use App\Models\RelatedParties\PrincipalRatio;
use App\Models\Scoring\Scoring;
use App\Models\Scoring\ScoringOption;
use App\Models\Scoring\ScoringQuestion;
use App\Models\Scoring\ScoringQuestionCategory;
use App\Models\Submission\SourceOfFund;
use App\Models\Submission\Submission;
use App\Models\Submission\SubmissionScore;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // obligiee
            'obligee.id' => ['nullable', 'exists:'.Obligee::class.',id,deleted_at,NULL'],
            'obligee.name' => ['required_if:obligee.id,NULL', 'nullable', 'string'],
            'obligee.pic' => ['required_if:obligee.id,NULL', 'nullable', 'string'],
            'obligee.no_ppk' => ['required_if:obligee.id,NULL', 'nullable', 'string'],
            'obligee.telephone' => ['required_if:obligee.id,NULL', 'nullable', 'string', 'not_in:0'],
            'obligee.province_id' => ['required_if:obligee.id,NULL', 'nullable', 'exists:'.Province::class.',id'],
            'obligee.regency_id' => ['required_if:obligee.id,NULL', 'nullable', 'exists:'.Regency::class.',id'],
            'obligee.district_id' => ['required_if:obligee.id,NULL', 'nullable', 'exists:'.District::class.',id'],
            'obligee.village' => ['required_if:obligee.id,NULL', 'nullable', 'string'],
            'obligee.address' => ['required_if:obligee.id,NULL', 'nullable', 'string'],
            'obligee.postal_code' => ['required_if:obligee.id,NULL', 'nullable', 'string'],

            // submission
            'submission' => ['required'],
            'submission.id' => ['nullable', 'exists:'.Submission::class.',id,deleted_at,NULL'], // id submission
            'submission.submission_before_id' => ['nullable', 'exists:'.Submission::class.',id,deleted_at,NULL'], // id submission
            'submission.submission_inherit_id' => ['nullable', 'exists:'.Submission::class.',id,deleted_at,NULL'], // id submission
            'submission.guarantor_id' => ['required', 'exists:'.Guarantor::class.',id,deleted_at,NULL'], // id penjamin
            'submission.guarantor_branch_id' => ['required', 'exists:'.Guarantor::class.',id,deleted_at,NULL'], // id penjamin cabang
            'submission.product_id' => ['required', 'exists:'.Product::class.',id,deleted_at,NULL'], // id produk
            'submission.product_type_id' => ['required', 'exists:'.ProductType::class.',id,deleted_at,NULL'], // id penjamin ke tipe produk
            'submission.job_group' => ['required', 'string', Rule::in(JobGroup::getValues())], // kelompok pekerjaan
            'submission.job_type' => ['required', 'string', Rule::in(JobType::getValues())], // jenis pekerjaan
            'submission.bank_id' => ['nullable', 'exists:'.Bank::class.',id,deleted_at,NULL'], // id bank
            'submission.blank_id' => ['required', 'exists:'.Blank::class.',id,deleted_at,NULL'], // id blank
            //            'submission.contract_doc_name' => ['required', 'string', 'max:255'], // nama dokumen kontrak
            //            'submission.contract_doc_number' => ['required', 'string', 'max:255'], // nomor dokumen kontrak
            //            'submission.contract_doc_date' => ['required', 'date'], // tanggal dokumen kontrak
            'submission.contract_value' => ['required', 'regex:/^[0-9]+([.,][0-9]{1,2})?$/'], // nilai kontrak
            'submission.guarantee_value' => ['required', 'regex:/^[0-9]+([.,][0-9]{1,2})?$/'], // nilai jaminan
            'submission.time_period' => ['required', 'numeric'], // jangka waktu (165 Hari)
            'submission.difference_time_period' => ['required'], // selisih waktu (1 Hari)
            'submission.start_date' => ['required', 'date'], // tanggal mulai
            'submission.end_date' => ['nullable', 'date'], // tanggal berakhir
            'submission.job_name' => ['nullable', 'string'], // nama pekerjaan
            'submission.job_location_province_id' => ['required', 'exists:'.Province::class.',id'], // id provinsi lokasi pekerjaan
            'submission.job_location_regency_id' => ['required', 'exists:'.Regency::class.',id'], // id kabupaten/kota lokasi pekerjaan
            'submission.job_location_district_id' => ['required', 'exists:'.District::class.',id'], // id kecamatan lokasi pekerjaan
            'submission.job_location_village' => ['required', 'string', 'max:255'], // desa lokasi pekerjaan
            'submission.job_location_address' => ['required', 'string'], // address lokasi pekerjaan
            'submission.job_location_postal_code' => ['required', 'string'], // kode pos lokasi pekerjaan
            'submission.source_of_fund_id' => ['required', 'exists:'.SourceOfFund::class.',id,deleted_at,NULL'], // id sumber dana
            'submission.note' => ['nullable', 'string'], // catatan
            'submission.risk_mitigation' => ['nullable', 'string'], // mitigasi risiko

            'submission.support_docs' => ['required', 'array', 'min:1'], // dokumen pendukung
            'submission.support_docs.*.id' => ['nullable', 'numeric'],
            'submission.support_docs.*.name' => ['required', 'string'],
            'submission.support_docs.*.number' => ['required', 'string'],
            'submission.support_docs.*.date' => ['required', 'date'],
            'submission.support_docs.*.file' => ['required_if:submission.support_docs.*.id,NULL', 'nullable', 'file', 'mimes:pdf', 'max:20480'], // file dokumen pendukung

            'principal.id' => ['required', 'exists:'.Principal::class.',id'],
            // principal ratios
            'principal.ratios' => ['required', 'array', 'min:1'],
            'principal.ratios.*.id' => ['nullable', 'exists:'.PrincipalRatio::class.',id,deleted_at,NULL'], // id rasio
            'principal.ratios.*.liquidity_ratios' => ['required'], // rasio likuiditas
            'principal.ratios.*.profitability_ratios' => ['required'], // rasio profitabilitas
            'principal.ratios.*.solvency_ratios' => ['required'], // rasio solvabilitas
            'principal.ratios.*.current_assets' => ['required'], // aktiva lancar
            'principal.ratios.*.current_debt' => ['required'], // utang lancar
            'principal.ratios.*.total_debt' => ['required'], // total utang
            'principal.ratios.*.total_assets' => ['required'], // total aktiva
            'principal.ratios.*.revenue' => ['required'], // pendapatan
            'principal.ratios.*.net_income' => ['required'], // laba bersih
            'principal.ratios.*.year' => ['required'], // tahun

            // scoring
            'scoring' => ['required'],
            'scoring.id' => ['required', 'exists:'.Scoring::class.',id,deleted_at,NULL'], // id scoring
            'scoring.note' => ['nullable', 'string'], // catatan

            'scoring.scores' => ['required', 'array'], // skor
            'scoring.scores.*.id' => ['nullable', 'exists:'.SubmissionScore::class.',id,deleted_at,NULL'], // id kategori pertanyaan skor
            'scoring.scores.*.scoring_question_category_id' => ['required', 'exists:'.ScoringQuestionCategory::class.',id,deleted_at,NULL'], // id kategori pertanyaan skor
            'scoring.scores.*.scoring_question_id' => ['required', 'exists:'.ScoringQuestion::class.',id,deleted_at,NULL'], // id pertanyaan skor
            'scoring.scores.*.scoring_option_id' => ['required', 'exists:'.ScoringOption::class.',id,deleted_at,NULL'], // id opsi skor
            'scoring.scores.*.point' => ['required', 'numeric'], // point skor
        ];
    }

    public function messages(): array
    {
        return [
            'obligee.name.required_if' => 'Nama pemberi pekerjaan wajib diisi',
            'obligee.pic.required_if' => 'Nama PIC wajib diisi',
            'obligee.no_ppk.required_if' => 'Nomor PPK wajib diisi',
            'obligee.telephone.required_if' => 'Nomor telepon wajib diisi',
            'obligee.province_id.required_if' => 'Provinsi wajib diisi',
            'obligee.regency_id.required_if' => 'Kabupaten/Kota wajib diisi',
            'obligee.district_id.required_if' => 'Kecamatan wajib diisi',
            'obligee.village.required_if' => 'Desa wajib diisi',
            'obligee.address.required_if' => 'Alamat wajib diisi',
            'obligee.postal_code.required_if' => 'Kode pos wajib diisi',

            'submission.guarantor_id.required' => 'Penjamin wajib diisi',
            'submission.guarantor_branch_id.required' => 'Cabang penjamin wajib diisi',
            'submission.product_id.required' => 'Produk wajib diisi',
            'submission.product_type_id.required' => 'Tipe produk wajib diisi',
            'submission.job_group.required' => 'Kelompok pekerjaan wajib diisi',
            'submission.job_type.required' => 'Jenis pekerjaan wajib diisi',
            'submission.blank_id.required' => 'Blangko wajib diisi',
            //            'submission.contract_doc_name.required' => 'Nama dokumen kontrak wajib diisi',
            //            'submission.contract_doc_number.required' => 'Nomor dokumen kontrak wajib diisi',
            //            'submission.contract_doc_date.required' => 'Tanggal dokumen kontrak wajib diisi',
            'submission.contract_value.required' => 'Nilai kontrak wajib diisi',
            'submission.guarantee_value.required' => 'Nilai jaminan wajib diisi',
            'submission.time_period.required' => 'Jangka waktu wajib diisi',
            'submission.start_date.required' => 'Tanggal mulai wajib diisi',
            'submission.job_location_province_id.required' => 'Provinsi lokasi pekerjaan wajib diisi',
            'submission.job_location_regency_id.required' => 'Kabupaten/Kota lokasi pekerjaan wajib diisi',
            'submission.job_location_district_id.required' => 'Kecamatan lokasi pekerjaan wajib diisi',
            'submission.job_location_village.required' => 'Desa lokasi pekerjaan wajib diisi',
            'submission.job_location_address.required' => 'Alamat lokasi pekerjaan wajib diisi',
            'submission.job_location_postal_code.required' => 'Kode pos lokasi pekerjaan wajib diisi',
            'submission.source_of_fund_id.required' => 'Sumber dana wajib diisi',

            'submission.support_docs.required' => 'Dokumen pendukung wajib diisi',
            'submission.support_docs.array' => 'Dokumen pendukung harus berupa array',
            'submission.support_docs.*.name.required' => 'Nama dokumen pendukung wajib diisi',
            'submission.support_docs.*.number.required' => 'Nomor dokumen pendukung wajib diisi',
            'submission.support_docs.*.date.required' => 'Tanggal dokumen pendukung wajib diisi',
            'submission.support_docs.*.file.required_if' => 'File dokumen pendukung wajib diisi',
            'submission.support_docs.*.file.file' => 'File dokumen pendukung harus berupa file',
            'submission.support_docs.*.file.mimes' => 'File dokumen pendukung harus berupa file pdf',
            'submission.support_docs.*.file.max' => 'File dokumen pendukung maksimal 20 MB',

            'principal.id.required' => 'Principal wajib diisi',
            'principal.ratios.required' => 'Rasio wajib diisi',
            'principal.ratios.*.liquidity_ratios.required' => 'Rasio likuiditas wajib diisi',
            'principal.ratios.*.profitability_ratios.required' => 'Rasio profitabilitas wajib diisi',
            'principal.ratios.*.solvency_ratios.required' => 'Rasio solvabilitas wajib diisi',
            'principal.ratios.*.current_assets.required' => 'Aktiva lancar wajib diisi',
            'principal.ratios.*.current_debt.required' => 'Utang lancar wajib diisi',
            'principal.ratios.*.total_debt.required' => 'Total utang wajib diisi',
            'principal.ratios.*.total_assets.required' => 'Total aktiva wajib diisi',
            'principal.ratios.*.revenue.required' => 'Pendapatan wajib diisi',
            'principal.ratios.*.net_income.required' => 'Laba bersih wajib diisi',
            'principal.ratios.*.year.required' => 'Tahun rasio wajib diisi',

            'scoring.id.required' => 'Scoring wajib diisi',
            'scoring.scores.required' => 'Skor wajib diisi',
            'scoring.scores.*.scoring_question_category_id.required' => 'Kategori pertanyaan skor wajib diisi',
            'scoring.scores.*.scoring_question_id.required' => 'Pertanyaan skor wajib diisi',
            'scoring.scores.*.scoring_option_id.required' => 'Opsi skor wajib diisi',
            'scoring.scores.*.point.required' => 'Point skor wajib diisi',
        ];
    }
}
