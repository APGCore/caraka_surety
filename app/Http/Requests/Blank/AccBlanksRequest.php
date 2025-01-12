<?php

namespace App\Http\Requests\Blank;

use App\Models\Guarantor\Blank;
use Illuminate\Foundation\Http\FormRequest;

class AccBlanksRequest extends FormRequest
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
            'blanks' => 'required|array',
            'blanks.*.id' => 'required|integer|exists:'.Blank::class.',id,deleted_at,NULL',
        ];
    }
}
