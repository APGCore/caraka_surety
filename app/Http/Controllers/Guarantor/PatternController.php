<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Profile\Profile;
use Illuminate\Http\Request;

class PatternController extends Controller
{
    public function convert(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'profile_id' => 'nullable|integer|exists:'.Profile::class.',id',
            'guarantor_id' => 'nullable|integer|exists:'.Guarantor::class.',id',
            'guarantor_branch_id' => 'nullable|integer|exists:'.Guarantor::class.',id',
            'guarantor_to_product_type_id' => 'nullable|integer|exists:'.GuarantorToProductType::class.',id',
            'number_blank' => 'nullable|string',
        ]);

        $profile = Profile::query()
            ->find($validated['profile_id'] ?? null);

        $guarantor = Guarantor::query()
            ->whereNull('headquarter_id')
            ->find($validated['guarantor_id'] ?? null);

        $guarantorBranch = Guarantor::query()
            ->whereNotNull('headquarter_id')
            ->find($validated['guarantor_branch_id'] ?? null);

        $guarantorToProductType = GuarantorToProductType::query()
            ->find($validated['guarantor_to_product_type_id'] ?? null);

        $contentTemplate = [
            'KA' => $guarantor->code ?? '40',
            'KC' => $guarantorBranch->code ?? '41',
            'KP' => $guarantorToProductType->code ?? '90.01',
            'KB' => $validated['number_blank'] ?? '2655919',
            'NOA' => $profile->code ?? '14',
        ];

        $data = convertPattern($request->get('content'), $contentTemplate['KA'], $contentTemplate['KC'], $contentTemplate['NOA'], $contentTemplate['KP'], $contentTemplate['KB']);

        return $this->responseSuccess('Berhasil Convert Pattern', $data['value']);
    }
}
