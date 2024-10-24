<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use Illuminate\Http\Request;

class PatternController extends Controller
{
    public function convert(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'guarantor_id' => 'nullable|integer|exists:'.Guarantor::class.',id',
            'guarantor_to_product_type_id' => 'nullable|integer|exists:'.GuarantorToProductType::class.',id',
            'number_blank' => 'nullable|string',
        ]);

        $guarantor = Guarantor::query()
            ->find($validated['guarantor_id'] ?? null);

        $guarantorToProductType = GuarantorToProductType::query()
            ->find($validated['guarantor_to_product_type_id'] ?? null);

        $contentTemplate = [
            'KA' => $guarantor->code ?? '40',
            'KP' => $guarantorToProductType->code ?? '90.01',
            'KB' => $validated['number_blank'] ?? '2655919',
        ];

        $result = convertPattern($request->get('content'), $contentTemplate['KA'], $contentTemplate['KP'], $contentTemplate['KB']);

        return $this->responseSuccess('Berhasil Convert Pattern', $result);
    }
}
