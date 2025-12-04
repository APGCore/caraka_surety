<?php

namespace App\Http\Requests\Principal;

use App\Models\Document\RequiredDoc;
use App\Models\RelatedParties\Principal;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UploadDocumentExtRequest extends FormRequest
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
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'principal_id' => ['required', 'exists:'.Principal::class.',id'],
            'required_doc_code' => ['required', 'exists:'.RequiredDoc::class.',code'],
            'url' => ['required', 'string'],
        ];
    }
}
