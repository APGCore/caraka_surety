<?php

namespace App\Http\Requests\Obligee;

use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
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
            'name' => ['required', 'string', 'max:255'],
            'telephone' => ['required', 'string', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'province_id' => ['required', 'exists:'.Province::class.',id'],
            'regency_id' => ['required', 'exists:'.Regency::class.',id'],
            'district_id' => ['required', 'exists:'.District::class.',id'],
            'village' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:255'],
            'fax' => ['nullable', 'string', 'max:255'],
            'pic' => ['required', 'string', 'max:255'],
        ];
    }
}
