<?php

namespace App\Http\Requests\Guarantor\Blank;

use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use Illuminate\Foundation\Http\FormRequest;

class StoreMultiRequest extends FormRequest
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
            'guarantor_id' => ['required', 'integer', 'exists:'.Guarantor::class.',id,deleted_at,NULL'],
            'number_start' => ['required', 'string', 'max:255', 'unique:'.Blank::class.',number,NULL,id,deleted_at,NULL'],
            'number_end' => ['required', 'string', 'max:255', 'unique:'.Blank::class.',number,NULL,id,deleted_at,NULL'],
        ];
    }

    /**
     * Get the validation messages that apply to the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'number_start.required' => 'Nomor blangko pertama harus diisi',
            'number_start.string' => 'Nomor blangko pertama harus berupa string',
            'number_start.max' => 'Nomor blangko pertama maksimal 255 karakter',
            'number_start.unique' => 'Nomor blangko pertama sudah digunakan',
            'number_end.required' => 'Nomor blangko terakhir harus diisi',
            'number_end.string' => 'Nomor blangko terakhir harus berupa string',
            'number_end.max' => 'Nomor blangko terakhir maksimal 255 karakter',
            'number_end.unique' => 'Nomor blangko terakhir sudah digunakan',
        ];
    }
}
