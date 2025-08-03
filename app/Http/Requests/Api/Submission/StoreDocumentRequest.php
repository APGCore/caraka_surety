<?php

namespace App\Http\Requests\Api\Submission;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
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
            'documents' => 'required|array',
            'documents.*.id' => 'required|exists:document_formats,id',
            'documents.*.name' => 'nullable|string|max:255',
            'documents.*.content' => 'required|string',
            'documents.*.url' => 'nullable|string|max:255',
        ];
    }
}
