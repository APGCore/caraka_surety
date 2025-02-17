<?php

namespace App\Http\Requests\Api\Submission;

use App\Models\Submission\Submission;
use Illuminate\Foundation\Http\FormRequest;

class CallbackRequest extends FormRequest
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
            'submission_id' => 'required|exists:'.Submission::class.',id',
            'doc_url' => 'required|string',
        ];
    }
}
