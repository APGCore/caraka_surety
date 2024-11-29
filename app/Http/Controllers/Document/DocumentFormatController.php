<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Models\Document\DocumentFormat;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\Product;
use Illuminate\Http\Request;

class DocumentFormatController extends Controller
{
    private function getGuarantorData(Request $request)
    {
        $guarantors = Guarantor::query()->select('id', 'name')->get();
        $guarantorSelected = $request->get('guarantor_id');
        $guarantorSelected = $guarantorSelected ? (int) $guarantorSelected : 0;
        $guarantor = $guarantors->find($guarantorSelected)?->load(['guarantorToProductTypes', 'guarantorToProductTypes.product']);
        $products = Product::all();
        $productSelected = $request->get('product_id');
        $productSelected = $productSelected ? (int) $productSelected : 0;
        $guarantorProductTypes = $guarantor?->guarantorToProductTypes->where('product_id', $productSelected)->values();
        $guarantorProductTypeSelected = $request->get('guarantor_product_type_id');

        return [
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'products' => $products,
            'productSelected' => $productSelected,
            'guarantorProductTypes' => $guarantorProductTypes,
            'guarantorProductTypeSelected' => $guarantorProductTypeSelected,
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $data = $this->getGuarantorData($request);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Format Dokumen',
            ],
            ...$data,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $data = $this->getGuarantorData($request);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Membuat Format Dokumen',
            ],
            ...$data,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(DocumentFormat $principalDocumentFormating)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentFormat $principalDocumentFormating)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentFormat $principalDocumentFormating)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentFormat $principalDocumentFormating)
    {
        //
    }
}
