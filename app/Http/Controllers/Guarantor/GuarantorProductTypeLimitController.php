<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Resources\Guarantor\GuarantorToProductTypeResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorProductTypeLimit;
use App\Models\Guarantor\GuarantorToProductType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GuarantorProductTypeLimitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::with(['product', 'productType'])->get();
        $guarantor = $guarantors->find($request->get('guarantor_id')) ?? $guarantors->first();

        $products = $guarantor?->product?->unique();
        $product = $products?->find($request->get('product_id')) ?? $products?->first();

        $guarantorSelected = $guarantor->id ?? null;
        $productSelected = $product->id ?? null;

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
                'title' => 'Setting Limit Produk Asuransi',
            ],
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'products' => $products,
            'productSelected' => $productSelected,
            'guarantorProductTypes' => fn () => $resource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'guarantor_id' => 'required|exists:'.Guarantor::class.',id',
            'guarantor_to_product_type_id' => 'required|exists:'.GuarantorToProductType::class.',id',
            'limit' => 'required',
        ]);

        try {
            DB::beginTransaction();
            $limit = (float) str_replace('.', '', $request->get('limit'));
            $limitInherit = $request->get('limit_inherit')
                ? (float) str_replace('.', '', $request->get('limit_inherit'))
                : $limit;
            GuarantorProductTypeLimit::create([
                'guarantor_id' => $request->get('guarantor_id'),
                'guarantor_to_product_type_id' => $request->get('guarantor_to_product_type_id'),
                'limit' => $limit,
                'limit_inherit' => $limitInherit,
            ]);

            activity()
                ->useLog('guarantor-product-type-limit')
                ->performedOn(new GuarantorToProductType)
                ->causedBy(auth()->user())
                ->log('Menambahkan limit produk asuransi');
            flashMessage('success', 'Limit berhasil disimpan');
            DB::commit();

            return redirect()->route('guarantor-product-type-limit.index', [
                'guarantor_id' => $request->get('guarantor_id'),
                'product_id' => $request->get('product_id'),
            ])->with('success', 'Limit berhasil disimpan');
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('error', 'Limit gagal disimpan', 'error');
            Log::error('Error store limit: ', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Limit gagal disimpan');
        }

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, GuarantorProductTypeLimit $guarantorProductTypeLimit)
    {
        $request->validate([
            'limit' => 'required',
        ]);

        try {
            DB::beginTransaction();
            $limit = (float) str_replace('.', '', $request->get('limit'));
            $limitInherit = $request->get('limit_inherit')
                ? (float) str_replace('.', '', $request->get('limit_inherit'))
                : $limit;
            $guarantorProductTypeLimit->update([
                'limit' => $limit,
                'limit_inherit' => $limitInherit,
            ]);
            activity()
                ->useLog('guarantor-product-type-limit')
                ->performedOn($guarantorProductTypeLimit)
                ->causedBy(auth()->user())
                ->log('Mengubah limit produk asuransi');
            flashMessage('success', 'Limit berhasil diubah');
            DB::commit();

            return redirect()->route('guarantor-product-type-limit.index', [
                'guarantor_id' => $request->get('guarantor_id'),
                'product_id' => $request->get('product_id'),
            ])->with('success', 'Limit berhasil diubah');
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('error', 'Limit gagal diubah', 'error');
            Log::error('Error update limit: ', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Limit gagal diubah');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(GuarantorProductTypeLimit $guarantorProductTypeLimit)
    {
        try {
            $guarantorProductTypeLimit->delete();
            flashMessage('success', 'Limit berhasil dihapus');

            return redirect()->back()->with('success', 'Limit berhasil dihapus');
        } catch (\Exception $e) {
            flashMessage('error', 'Limit gagal dihapus', 'error');
            Log::error('Error delete limit: ', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with('error', 'Limit gagal dihapus');
        }
    }
}
