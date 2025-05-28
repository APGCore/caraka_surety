<?php

namespace App\Http\Requests\Employee;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class UpdateRequest extends FormRequest
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
        $id = $this->employee?->id ?? 'NULL';

        return [
            'name' => 'required|string',
            'username' => 'required|string|unique:'.User::class.',username,'.$id.',id,deleted_at,NULL',
            'email' => 'nullable|email|unique:'.User::class.',email,'.$id.',id,deleted_at,NULL',
            'phone' => 'nullable|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'head_id' => 'nullable|exists:users,id',
            'profile_id' => 'required|exists:profiles,id',
            'role_id' => 'required|exists:roles,id',
            'password' => 'nullable|string|min:8|confirmed',

            'office_monitorings' => ['nullable', 'array'],
            'office_monitorings.*.office_monitoring_id' => ['nullable', 'exists:office_monitorings,id'],
            'office_monitorings.*.office_id' => ['required', 'exists:profiles,id'],
        ];
    }
}
