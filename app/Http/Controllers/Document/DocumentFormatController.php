<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Http\Resources\Document\DocumentFormatResource;
use App\Models\Document\DocumentFormat;
use App\Models\Guarantor\Guarantor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DocumentFormatController extends Controller
{
    private function getGuarantorData(Request $request)
    {
        $guarantors = Guarantor::query()->select('id', 'name')->get();
        $guarantorSelected = $request->get('guarantor_id');
        $guarantorSelected = $guarantorSelected ? (int) $guarantorSelected : null;
        $guarantor = $guarantors->find($guarantorSelected)?->load(['guarantorToProductTypes', 'guarantorToProductTypes.product']);
        $products = $guarantor?->guarantorToProductTypes->pluck('product')->unique()->values();
        $productSelected = $request->get('guarantor_product_id');
        $productSelected = $productSelected ? (int) $productSelected : null;
        $guarantorProductTypes = $guarantor?->guarantorToProductTypes->where('product_id', $productSelected)->values();
        $guarantorProductTypeSelected = $request->get('guarantor_to_product_type_id');
        $guarantorProductTypeSelected = $guarantorProductTypeSelected ? (int) $guarantorProductTypeSelected : null;

        $documentFormats = DocumentFormat::search($request->get('search'))
            ->query(function ($query) use ($guarantorSelected, $productSelected, $guarantorProductTypeSelected) {
                $query->where('guarantor_id', $guarantorSelected)
                    ->where('product_id', $productSelected)
                    ->where('guarantor_to_product_type_id', $guarantorProductTypeSelected);
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resourceDocumentFormats = DocumentFormatResource::collection($documentFormats);

        return [
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'products' => $products,
            'productSelected' => $productSelected,
            'guarantorProductTypes' => $guarantorProductTypes,
            'guarantorProductTypeSelected' => $guarantorProductTypeSelected,
            'documentFormats' => fn () => $resourceDocumentFormats,
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
        $request->validate([
            'guarantor_id' => 'nullable|integer',
            'guarantor_product_id' => 'nullable|integer',
            'guarantor_product_type_id' => 'nullable|integer',
            'name' => 'required|string',
            'format_document' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            DocumentFormat::query()
                ->create([
                    'guarantor_id' => $request->get('guarantor_id'),
                    'guarantor_product_id' => $request->get('guarantor_product_id'),
                    'guarantor_product_type_id' => $request->get('guarantor_product_type_id'),
                    'name' => $request->get('name'),
                    'format_document' => $request->get('format_document'),
                ]);

            DB::commit();

            activity()
                ->performedOn(new DocumentFormat)
                ->causedBy(auth()->user())
                ->log('menambahkan format dokumen');

            return redirect()->back()->with('success', 'Berhasil menyimpan data');
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Gagal menyimpan data', 'error');
            Log::error('Error store format document', ['error' => $e->getMessage()]);

            return redirect()->back()->withErrors('Gagal menyimpan data');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(DocumentFormat $documentFormat)
    {
        $component = str_replace(('/'.$documentFormat->getAttribute('id')), '', request()->path()).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Format Dokumen',
            ],
            'documentFormat' => $documentFormat,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentFormat $documentFormat)
    {
        $request->validate([
            'name' => 'required|string',
            'format_document' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $documentFormat->update([
                'name' => $request->get('name'),
                'format_document' => $request->get('format_document'),
            ]);

            DB::commit();

            activity()
                ->performedOn($documentFormat)
                ->causedBy(auth()->user())
                ->log('mengubah format dokumen');

            return redirect()->back()->with('success', 'Berhasil menyimpan data');
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Gagal menyimpan data', 'error');
            Log::error('Error update format document', ['error' => $e->getMessage()]);

            return redirect()->back()->withErrors('Gagal menyimpan data');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(DocumentFormat $documentFormat)
    {
        try {
            $documentFormat->delete();

            activity()
                ->performedOn($documentFormat)
                ->causedBy(auth()->user())
                ->log('menghapus format dokumen');

            return redirect()->back()->with('success', 'Berhasil menghapus data');
        } catch (\Exception $e) {
            flashMessage('Gagal', 'Gagal menghapus data', 'error');
            Log::error('Error delete format document', ['error' => $e->getMessage()]);

            return redirect()->back()->withErrors('Gagal menghapus data');
        }
    }
}
