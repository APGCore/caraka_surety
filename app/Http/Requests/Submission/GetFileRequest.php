<?php

namespace App\Http\Requests\Submission;

use Illuminate\Foundation\Http\FormRequest;

class GetFileRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'path' => ['required', 'string'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
