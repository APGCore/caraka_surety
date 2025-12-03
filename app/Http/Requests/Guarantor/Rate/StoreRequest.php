<?php

namespace App\Http\Requests\Guarantor\Rate;

class StoreRequest extends ListRequest
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
            ...parent::rules(),
            'minimum_payment' => ['required', 'string'],
            'pay_rate' => ['required', 'numeric'],
            'payment_administration' => ['required', 'string'],
            'stamp_duty' => ['required', 'string'],
            'broken_rate' => ['required', 'string'],
            'revised_rate' => ['required', 'string'],
            'commission' => ['required', 'numeric'],
            'pph' => ['required', 'numeric'],
            'effective_at' => ['required', 'date'],
        ];
    }
}
