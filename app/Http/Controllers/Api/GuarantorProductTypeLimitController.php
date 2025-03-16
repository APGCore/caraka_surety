<?php

namespace App\Http\Controllers\Api;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Http\Controllers\Controller;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Product\Product;
use Illuminate\Http\Request;

class GuarantorProductTypeLimitController extends Controller
{
    /**
     * Display data of the resource.
     */
    public function show(Request $request)
    {
        $request->validate([
            'guarantor_id' => 'nullable|exists:'.Guarantor::class.',id',
            'product_type_id' => 'required|exists:'.Product::class.',id',
            'job_group' => 'required|in:'.implode(',', JobGroup::getValues()),
            'job_type' => 'required|in:'.implode(',', JobType::getValues()),
        ]);
        $guarantorId = $request->get('guarantor_id', config('guarantor.id'));
        $productTypeId = $request->get('product_type_id');
        $jobGroup = $request->get('job_group');
        $jobType = $request->get('job_type');

        $guarantorProductType = GuarantorToProductType::where('guarantor_id', $guarantorId)
            ->where('product_type_id', $productTypeId)
            ->where('job_group', $jobGroup)
            ->where('job_type', $jobType)
            ->select('id', 'guarantor_id', 'product_type_id', 'job_group', 'job_type')
            ->first();
        $user = $request->user();
        $profileLimit = ProfileLimit::where('guarantor_id', $guarantorId)
            ->where('guarantor_to_product_type_id', $guarantorProductType->id)
            ->where('profile_id', $user->profile_id)
            ->select('id', 'guarantor_id', 'guarantor_to_product_type_id', 'profile_id', 'limit')
            ->first();

        $limit = $profileLimit->limit ?? 0;

        return $this->responseSuccess('Data ditemukan', compact('limit'));
    }
}
