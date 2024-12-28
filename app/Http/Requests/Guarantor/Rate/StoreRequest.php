<?php

namespace App\Http\Requests\Guarantor\Rate;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'guarantor_rate_id' => ['nullable', 'integer', Rule::exists('guarantor_rates')->whereNull('deleted_at')],
            'guarantor_id' => ['required', 'integer', Rule::exists('guarantors', 'id')->whereNull('deleted_at')],
            'guarantor_to_product_type_id' => ['required', 'integer', Rule::exists('guarantor_to_product_types', 'id')->whereNull('deleted_at')],
            'minimum_bill' => ['required', 'string'],
            'minimum_payment' => ['required', 'string'],
            'selling_rate' => ['required', 'numeric'],
            'pay_rate' => ['required', 'numeric'],
            'sales_administration' => ['required', 'string'],
            'payment_administration' => ['required', 'string'],
            'management_fee' => ['required', 'numeric'],
            'minimum_management_fee' => ['required', 'string'],
            'stamp_duty' => ['required', 'string'],
            'broken_rate' => ['required', 'string'],
            'revised_rate' => ['required', 'string'],
        ];
    }
}
