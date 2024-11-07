<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\Product\StoreRequest;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product\Product;

class GuarantorToProductTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $guarantors = Guarantor::all();
        $products = Product::all();
        $jobGroups = JobGroup::getValues();
        $jobTypes = JobType::getValues();

        $component = request()->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Data Produk Asuransi',
            ],
            'guarantors' => $guarantors,
            'products' => $products,
            'jobGroups' => $jobGroups,
            'jobTypes' => $jobTypes,
        ]);
    }

    public function getByGuarantor($guarantorId)
    {
        $guarantor = Guarantor::query()->find($guarantorId);
        $productTypes = collect($guarantor->guarantorToProductTypes);
        $products = $productTypes->pluck('product')->unique()->values();

        return $this->responseSuccess('Data produk asuransi berhasil diambil', compact('products', 'productTypes'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $requestValid = $request->validated();
        $data = collect($requestValid['data']);
        try {
            GuarantorToProductType::query()->where('guarantor_id', $requestValid['guarantor_id'])->delete();
            foreach ($data as $item) {
                $item['guarantor_id'] = $requestValid['guarantor_id'];
                $item['full_name'] = $item['name'].' '.$item['job_group'].' '.$item['job_type'];
                GuarantorToProductType::query()->create($item);
            }

            return $this->responseSuccess('Data produk asuransi berhasil disimpan');
        } catch (\Exception $e) {
            return $this->responseError('Data produk asuransi gagal disimpan', $e->getMessage());
        }
    }
}
