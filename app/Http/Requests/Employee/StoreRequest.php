<?php

namespace App\Http\Requests\Employee;

use App\Models\User;
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
            'name' => 'required|string',
            'username' => 'required|string|unique:users,username,NULL,id,deleted_at,NULL',
            'email' => 'nullable|email|unique:users,email,NULL,id,deleted_at,NULL',
            'password' => 'required|string|min:8',
            'password_confirmation' => 'required|same:password',
            'phone' => 'nullable|string',
            'picture' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'head_id' => 'nullable|exists:users,id',
            'profile_id' => 'required|exists:profiles,id',
            'role_id' => 'required|exists:roles,id',
        ];
    }
}
