<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Guarantor\GuarantorToProductTypeResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorProductTypeLimit;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Guarantor\ProfileLimit;
use Illuminate\Http\Request;

class GuarantorProductTypeLimitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::with(['product', 'productType'])->get();
        $guarantor = $guarantors->find($request->get('guarantor_id')) ?? $guarantors->first();

        $products = $guarantor->product->unique();
        $product = $products->find($request->get('product_id')) ?? $products->first();

        $guarantorSelected = $guarantor->id ?? null;
        $productSelected = $product->id ?? null;

        $limit = ProfileLimit::query()
            ->where('guarantor_id', $guarantorSelected)
            ->first();
        if ($limit) {
            $limit_used = GuarantorProductTypeLimit::query()
                ->where('guarantor_id', $guarantorSelected)
                ->whereHas('guarantorToProductType', function ($query) use ($productSelected) {
                    $query->where('product_id', $productSelected);
                })
                ->sum('limit');

            $limit->setAttribute('limit_used', $limit_used);
        }

        $guarantorProductTypes = GuarantorToProductType::search($request->get('search'))
            ->query(function ($query) use ($guarantorSelected, $productSelected) {
                $query->where('guarantor_id', $guarantorSelected)
                    ->where('product_id', $productSelected)
                    ->with(['limit' => function ($query) use ($guarantorSelected) {
                        $query->where('guarantor_id', $guarantorSelected);
                    }])
                    ->select('id', 'guarantor_id', 'code', 'full_name', 'created_at', 'updated_at');
            })
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = GuarantorToProductTypeResource::collection($guarantorProductTypes);

        $component = request()->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Setting Limit Produk Penjamin',
            ],
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'products' => $products,
            'productSelected' => $productSelected,
            'limit' => $limit,
            'guarantorProductTypes' => fn () => $resource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'guarantor_id' => 'required|exists:guarantors,id',
            'product_id' => 'required|exists:products,id',
            'guarantor_to_product_type_id' => 'required|exists:guarantor_to_product_types,id',
            'limit' => 'required|numeric|min:1',
        ]);

        GuarantorProductTypeLimit::create([
            'guarantor_id' => $request->get('guarantor_id'),
            'guarantor_to_product_type_id' => $request->get('guarantor_to_product_type_id'),
            'limit' => $request->get('limit'),
        ]);

        return redirect()->back()->with('success', 'Limit berhasil disimpan');
    }
}
