<?php

namespace App\Http\Requests\Guarantor\Blank;

use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
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
            'guarantor_id' => ['required', 'integer', 'exists:'.Guarantor::class.',id,deleted_at,NULL'],
            'number' => ['required', 'string', 'max:255', 'unique:'.Blank::class.',number,'.$this->route('blank')->id.',id,deleted_at,NULL'],
        ];
    }
}
