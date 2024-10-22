<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\Rate\StoreRequest;
use App\Http\Resources\Product\ProductTipeResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product\ProductType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GuarantorRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $guarantors = Guarantor::with(['product', 'productType'])->get();
        $guarantor = $guarantors->find($request->get('guarantor_id')) ?? $guarantors->first();

        $products = $guarantor->product->unique();
        $product = $products->find($request->get('product_id')) ?? $products->first();

        $guarantorSelected = $guarantor->id ?? null;
        $productSelected = $product->id ?? null;

        $productTypesId = $productSelected
            ? Guarantor::query()
                ->whereHas('product', fn ($query) => $query->where('product_id', $productSelected))
                ->with('productType')
                ->get()
                ->pluck('productType')
                ->flatten()
                ->pluck('id')
                ->unique()
            : [];

        $productTypes = ProductType::search($request->get('search'))
            ->query(function ($query) use ($guarantor, $product, $productTypesId) {
                $query->with('guarantorToProductType', function ($query) use ($guarantor, $product) {
                    $query->where('guarantor_id', $guarantor->id)
                        ->where('product_id', $product->id);
                })->whereIn('id', $productTypesId);
            })
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = ProductTipeResource::collection($productTypes);

        $component = request()->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tarif Asuransi',
            ],
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'products' => $products,
            'productSelected' => $productSelected,
            'productTypes' => fn () => $resource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request, GuarantorToProductType $guarantorToProductType): \Inertia\Response
    {
        $component = str_replace('/'.$guarantorToProductType->getAttribute('id'), '', $request->path()).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tarif Asuransi',
            ],
            'guarantorToProductType' => $guarantorToProductType,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request, GuarantorToProductType $guarantorToProductType)
    {
        $requestValid = $request->validated();

        try {

            $data = [
                ...$requestValid,
                'minimum_bill' => $this->currencyConvert($requestValid['minimum_bill']),
                'minimum_payment' => $this->currencyConvert($requestValid['minimum_payment']),
                'sales_administration' => $this->currencyConvert($requestValid['sales_administration']),
                'payment_administration' => $this->currencyConvert($requestValid['payment_administration']),
                'management_fee' => $this->currencyConvert($requestValid['management_fee']),
                'minimum_management_fee' => $this->currencyConvert($requestValid['minimum_management_fee']),
                'broken_rate' => $this->currencyConvert($requestValid['broken_rate']),
                'revised_rate float' => $this->currencyConvert($requestValid['revised_rate']),
            ];

            $guarantorToProductType->update($data);

            flashMessage('Berhasil', 'Data berhasil disimpan');

            return redirect()->route('guarantor-rate.index', [
                'guarantor_id' => $guarantorToProductType->getAttribute('guarantor_id'),
                'product_id' => $guarantorToProductType->getAttribute('product_id'),
            ]);
        } catch (\Exception $e) {
            flashMessage('Gagal', 'Gagal menyimpan data', 'error');
            Log::error('Error store guarantor rate', ['error' => $e->getMessage()]);

            return back()->with('error', 'Gagal menyimpan data');
        }
    }
    //
}
