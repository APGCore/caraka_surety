<?php

namespace App\Http\Requests\Guarantor\Product;

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
            'guarantor_id' => 'required|exists:guarantors,id,deleted_at,NULL',
            'data' => 'required|array',
            'data.*.product_id' => 'required|exists:products,id,deleted_at,NULL',
            'data.*.product_type_id' => 'required|exists:product_types,id,deleted_at,NULL',
            'data.*.code' => 'required|string|max:255',
            'data.*.name' => 'required|string|max:255',
            'data.*.job_group' => 'required|string|max:255',
        ];
    }
}
