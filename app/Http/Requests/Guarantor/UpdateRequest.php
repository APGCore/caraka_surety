<?php

namespace App\Http\Requests\Guarantor;

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
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'telephone' => ['required', 'string', 'max:255'],
            'fax' => ['nullable', 'string', 'max:255'],
            'pic' => ['required', 'string', 'max:255'],
            'picture' => ['nullable', 'image', 'max:2048'],
            'province_id' => ['required', 'exists:provinces,id'],
            'regency_id' => ['required', 'exists:regencies,id'],
            'district_id' => ['required', 'exists:districts,id'],
            'village' => ['required', 'string', 'max:255'],
        ];
    }
}
