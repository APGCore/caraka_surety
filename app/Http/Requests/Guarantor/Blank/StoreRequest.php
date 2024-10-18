<?php

namespace App\Http\Requests\Guarantor\Blank;

use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
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
            'guarantor_id' => ['required', 'integer', 'exists:'.Guarantor::class.',id,deleted_at,NULL'],
            'number' => ['required', 'string', 'max:255', 'unique:'.Blank::class.',number,NULL,id,deleted_at,NULL'],
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
            'number.required' => 'Nomor blangko harus diisi',
            'number.string' => 'Nomor blangko harus berupa string',
            'number.max' => 'Nomor blangko maksimal 255 karakter',
            'number.unique' => 'Nomor blangko sudah digunakan',
        ];
    }
}
