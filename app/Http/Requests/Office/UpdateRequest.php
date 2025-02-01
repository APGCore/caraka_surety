<?php

namespace App\Http\Requests\Office;

use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\Profile\Profile;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
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
            'code' => ['required', 'string', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:'.Profile::class.',email,'.$this->id.',id,deleted_at,NULL'],
            'phone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:255'],
            'province_id' => ['required', 'exists:'.Province::class.',id'],
            'regency_id' => ['required', 'exists:'.Regency::class.',id'],
            'district_id' => ['required', 'exists:'.District::class.',id'],
            'village' => ['required', 'string', 'max:255'],
            'pairing_guarantor' => ['required', 'array'],
            'office_type' => ['required'],
        ];
    }
}
