<?php

namespace App\Http\Requests\Guarantor\Rate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListRequest extends FormRequest
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
            'guarantor_id' => ['required', 'integer', Rule::exists('guarantors', 'id')->whereNull('deleted_at')],
            'guarantor_branch_id' => ['nullable', 'integer', Rule::exists('guarantors', 'id')->whereNull('deleted_at')],
            'guarantor_to_product_type_id' => ['required', 'integer', Rule::exists('guarantor_to_product_types', 'id')->whereNull('deleted_at')],
        ];
    }
}
