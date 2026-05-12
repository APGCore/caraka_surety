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
            'telephone' => ['required', 'string', 'regex:/^0[1-9][0-9]*$/',  'max:255'], // telepon perusahaan
            'fax' => ['nullable', 'string', 'max:255'], // fax perusahaan
            'postal_code' => ['required', 'string', 'max:5'], // npwp perusahaan
            'npwp' => ['required', 'string', 'max:255'], // npwp perusahaan
            'nib' => ['nullable', 'string', 'max:255'], // nib perusahaan
            'siup_siujk' => ['nullable', 'string', 'max:255'], // siup/siujk perusahaan
            'head_name' => ['nullable', 'string', 'max:255'], // nama kepala perusahaan
            'director_name' => ['required', 'string', 'max:255'], // nama direktur perusahaan
            'director_position' => ['required', 'string', 'max:255'], // jabatan direktur perusahaan
            'director_phone' => ['required', 'string', 'regex:/^0[1-9][0-9]*$/', 'max:255'], // telepon direktur perusahaan
            'commissioner' => ['nullable', 'string', 'max:255'], // komisaris perusahaan
            'year_established' => ['required', 'string', 'max:255'], // tahun berdiri perusahaan
            'est_deed' => ['nullable', 'string', 'max:255'], // akta pendirian perusahaan
            'last_deed' => ['nullable', 'string', 'max:255'], // akta terakhir perusahaan
            'business_fields' => ['nullable', 'string', 'max:255'], // bidang usaha perusahaan
        ];
    }

    public function messages(): array
    {
        return [
            'province_id.required' => 'Provinsi harus diisi',
            'regency_id.required' => 'Kota/Kabupaten harus diisi',
            'district_id.required' => 'Kecamatan harus diisi',
            'village.required' => 'Desa/Kelurahan harus diisi',
            'name.required' => 'Nama Perusahaan harus diisi',
            'address.required' => 'Alamat Perusahaan harus diisi',
            'telephone.required' => 'No Telepon Perusahaan harus diisi',
            'telephone.regex' => 'No Telepon Perusahaan harus angka',
            'fax.required' => 'Fax Perusahaan harus diisi',
            'postal_code.required' => 'Kode Pos Perusahaan harus diisi',
            'npwp.required' => 'NPWP Perusahaan harus diisi',
            'nib.required' => 'NIB Perusahaan harus diisi',
            'siup_siujk.required' => 'SIUP/SIUJK Perusahaan harus diisi',
            'head_name.required' => 'Nama Kepala Perusahaan harus diisi',
            'director_name.required' => 'Nama Direktur Perusahaan harus diisi',
            'director_position.required' => 'Jabatan Direktur Perusahaan harus diisi',
            'director_phone.required' => 'No Telepon Direktur Perusahaan harus diisi',
            'director_phone.regex' => 'Telepon Direktur Perusahaan harus angka',
            'commissioner.required' => 'Komisaris Perusahaan harus diisi',
            'year_established.required' => 'Tahun Berdiri Perusahaan harus diisi',
            'est_deed.required' => 'Akta Pendirian Perusahaan harus diisi',
            'last_deed.required' => 'Akta Terakhir Perusahaan harus diisi',
            'business_fields.required' => 'Bidang Usaha Perusahaan harus diisi',
        ];
    }
}
