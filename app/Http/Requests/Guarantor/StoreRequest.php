<?php

namespace App\Http\Requests\Guarantor;

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
            'code' => ['required', 'string', 'max:32'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'address' => ['required', 'string', 'max:255'],
            'telephone' => ['required', 'string', 'max:255'],
            'fax' => ['nullable', 'string', 'max:255'],
            'pic' => ['required', 'string', 'max:255'],
            'upload_picture' => ['nullable', 'image', 'max:2048'],
            'province_id' => ['required', 'exists:provinces,id'],
            'regency_id' => ['required', 'exists:regencies,id'],
            'district_id' => ['required', 'exists:districts,id'],
            'village' => ['required', 'string', 'max:255'],
            'postal_code' => ['required', 'string', 'max:255'],

            // pattern
            'prefix' => ['nullable', 'string', 'max:255'],
            'content' => ['required', 'string', 'max:255'],
            'suffix' => ['nullable', 'string', 'max:255'],
        ];
    }
}
