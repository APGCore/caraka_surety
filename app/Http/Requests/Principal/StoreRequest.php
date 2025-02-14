<?php

namespace App\Http\Requests\Principal;

use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
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
            'province_id' => ['required', 'exists:'.Province::class.',id'],
            'regency_id' => ['required', 'exists:'.Regency::class.',id'],
            'district_id' => ['required', 'exists:'.District::class.',id'],
            'village' => ['nullable', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'], // nama perusahaan
            'address' => ['required', 'string', 'max:255'], // alamat perusahaan
            'telephone' => ['required', 'string', 'max:255'], // telepon perusahaan
            'fax' => ['nullable', 'string', 'max:255'], // fax perusahaan
            'postal_code' => ['required', 'string', 'max:255'], // npwp perusahaan
            'npwp' => ['required', 'string', 'max:255'], // npwp perusahaan
            'nib' => ['nullable', 'string', 'max:255'], // nib perusahaan
            'siup_siujk' => ['nullable', 'string', 'max:255'], // siup/siujk perusahaan
            'head_name' => ['nullable', 'string', 'max:255'], // nama kepala perusahaan
            'director_name' => ['required', 'string', 'max:255'], // nama direktur perusahaan
            'director_position' => ['required', 'string', 'max:255'], // jabatan direktur perusahaan
            'director_phone' => ['required', 'string', 'max:255'], // telepon direktur perusahaan
            'commissioner' => ['nullable', 'string', 'max:255'], // komisaris perusahaan
            'year_established' => ['required', 'string', 'max:255'], // tahun berdiri perusahaan
            'last_deed' => ['nullable', 'string', 'max:255'], // akta terakhir perusahaan
            'business_fields' => ['nullable', 'string', 'max:255'], // bidang usaha perusahaan
        ];
    }
}
