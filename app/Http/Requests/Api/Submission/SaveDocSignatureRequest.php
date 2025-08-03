<?php

namespace App\Http\Requests\Api\Submission;

use App\Models\Submission\Submission;
use Illuminate\Foundation\Http\FormRequest;

class SaveDocSignatureRequest extends FormRequest
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
            'spkmgr_file' => 'nullable|file|mimes:pdf,docx,doc|max:10240',
            'permohonan_file' => 'nullable|file|mimes:pdf,docx,doc|max:10240',
        ];
    }
}
