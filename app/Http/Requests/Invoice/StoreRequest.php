<?php

namespace App\Http\Requests\Invoice;

use App\Models\Submission\Submission;
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
            'submission_id' => 'required|integer|exists:'.Submission::class.',id,deleted_at,NULL',
            'minimum_bill' => 'required|string',
            'selling_rate' => 'required|string',
            'sales_administration' => 'required|string',
            'broken_rate' => 'required|string',
            'revised_rate' => 'required|string',
        ];
    }

    public function messages(): array
    {
        return [
            'submission_id.required' => 'Submission ID harus diisi.',
            'submission_id.integer' => 'Submission ID harus berupa angka.',
            'submission_id.exists' => 'Submission ID tidak ditemukan.',
            'minimum_bill.required' => 'Minimum harus diisi.',
            'minimum_bill.string' => 'Minimum harus berupa string.',
            'selling_rate.required' => 'Tarif harus diisi.',
            'selling_rate.string' => 'Tarif harus berupa string.',
            'sales_administration.required' => 'Administrasi penjualan harus diisi.',
        ];
    }
}
