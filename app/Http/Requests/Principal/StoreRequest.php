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
            'name' => ['required', 'string', 'max:255'],
            'telephone' => ['required', 'string', 'max:255'],
            'fax' => ['nullable', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'province_id' => ['required', 'exists:'.Province::class.',id'],
            'regency_id' => ['required', 'exists:'.Regency::class.',id'],
            'district_id' => ['required', 'exists:'.District::class.',id'],
            'village' => ['required', 'string', 'max:255'],
            'npwp' => ['required', 'string', 'max:255'],
            'nib' => ['required', 'string', 'max:255'],
            'siup_siujk' => ['required', 'string', 'max:255'],
            'head_name' => ['required', 'string', 'max:255'],
            'director_name' => ['required', 'string', 'max:255'],
            'director_position' => ['required', 'string', 'max:255'],
            'director_phone' => ['required', 'string', 'max:255'],
            'commissioner' => ['required', 'string', 'max:255'],
            'year_established' => ['required', 'integer'],
            'last_deed' => ['required', 'string', 'max:255'],
            'pic' => ['required', 'string', 'max:255'],
        ];
    }
}
