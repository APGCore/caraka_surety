<?php

namespace App\Http\Requests\Submission;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\ProductType;
use App\Models\RelatedParties\Principal;
use Illuminate\Foundation\Http\FormRequest;

class GetSubmissionRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'principal_id' => ['required', 'string', 'exists:'.Principal::class.',id,deleted_at,NULL'],
            'guarantor_id' => ['required', 'string', 'exists:'.Guarantor::class.',id,deleted_at,NULL'],
            'product_type_id' => ['required', 'string', 'exists:'.ProductType::class.',id,deleted_at,NULL'],
            'job_group' => 'required|in:'.implode(',', JobGroup::getValues()),
            'job_type' => 'required|in:'.implode(',', JobType::getValues()),
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
