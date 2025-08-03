<?php

namespace App\Http\Requests\Api\Submission;

use App\Models\Guarantor\Blank;
use App\Models\Submission\Submission;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SetBlankRequest extends FormRequest
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
            'submission_id' => 'required|exists:'.Submission::class.',id',
            'blank_id' => 'required|exists:'.Blank::class.',id',
        ];
    }
}
