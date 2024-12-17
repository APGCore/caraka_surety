<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\Product\StoreRequest;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
        $guarantor = Guarantor::query()
            ->with(['guarantorToProductTypes', 'guarantorToProductTypes.product', 'guarantorToProductTypes.productType'])
            ->find($guarantorId);
        $productTypes = collect($guarantor->guarantorToProductTypes);
        $products = $productTypes->pluck('product')->unique()->values()->map(function ($product) use ($productTypes) {
            $product->code = $productTypes->where('product_id', $product->id)->first()->code_product;

            return $product;
        });

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
            DB::beginTransaction();
            $data->each(function ($item) use ($requestValid) {
                $item['guarantor_id'] = $requestValid['guarantor_id'];
                $item['full_name'] = $item['name'].' '.$item['job_group'].' '.$item['job_type'];
                GuarantorToProductType::query()
                    ->updateOrCreate([
                        'id' => $item['id'] ?? null,
                    ], $item);
            });

            $guaratorProduct = GuarantorToProductType::query()
                ->where([
                    'guarantor_id' => $requestValid['guarantor_id'],
                    'product_id' => $data->pluck('product_id')->first(),
                ]);
            if ($guaratorProduct->get()->isNotEmpty()) {
                $dataIds = $guaratorProduct->get()->pluck('id')->unique()->filter();
                $guaratorProduct->whereNotIn('id', $dataIds)->delete();
            }
            activity()
                ->performedOn(new Guarantor)
                ->causedBy(auth()->user())
                ->log('Menambahkan data produk asuransi');

            DB::commit();

            return $this->responseSuccess('Data produk asuransi berhasil disimpan');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error store guarantor to product type', [
                'message' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);

            return $this->responseError('Data produk asuransi gagal disimpan', $e->getMessage());
        }
    }
}
