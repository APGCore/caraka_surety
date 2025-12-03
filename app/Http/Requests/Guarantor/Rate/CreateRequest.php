<?php

namespace App\Http\Requests\Guarantor\Rate;

class CreateRequest extends ListRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
}
