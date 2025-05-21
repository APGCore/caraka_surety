<?php

namespace App\Http\Requests\Guarantor\Product;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product\Product;
use App\Models\Product\ProductType;
use Illuminate\Contracts\Validation\ValidationRule;
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
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'guarantor_id' => 'required|exists:'.Guarantor::class.',id,deleted_at,NULL',
            'data' => 'required|array',
            'data.*.id' => 'nullable|exists:'.GuarantorToProductType::class.',id,deleted_at,NULL',
            'data.*.product_id' => 'required|exists:'.Product::class.',id,deleted_at,NULL',
            'data.*.product_type_id' => 'required|exists:'.ProductType::class.',id,deleted_at,NULL',
            'data.*.no' => 'required|numeric|min:1',
            'data.*.code_product' => 'required|string|max:255',
            'data.*.code' => 'required|string|max:255',
            'data.*.name' => 'required|string|max:255',
            'data.*.job_group' => 'nullable|string|in:'.implode(',', JobGroup::getValues()),
            'data.*.job_type' => 'nullable|string|in:'.implode(',', JobType::getValues()),
        ];
    }
}
