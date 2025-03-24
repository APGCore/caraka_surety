<?php

namespace App\Http\Controllers\Document;

use App\Http\Controllers\Controller;
use App\Http\Resources\Document\DocumentFormatResource;
use App\Models\Document\DocumentFormat;
use App\Models\Guarantor\Guarantor;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DocumentFormatController extends Controller
{
    private function getGuarantorData(Request $request)
    {
        $guarantors = Guarantor::query()->with('head:id,name')
            ->whereNull('headquarter_id')
            ->get(['id', 'headquarter_id', 'name']);
        $guarantorSelected = $request->get('guarantor_id');
        $guarantorSelected = $guarantorSelected ? (int) $guarantorSelected : null;
        $guarantor = $guarantors->find($guarantorSelected);
        if ($guarantor?->headquarter_id) {
            $guarantor = $guarantor->head ?? null;
        }
        $guarantor?->load(['guarantorToProductTypes', 'guarantorToProductTypes.product']);
        $products = $guarantor?->guarantorToProductTypes->pluck('product')->unique()->values();
        $productSelected = $request->get('guarantor_product_id');
        $productSelected = $productSelected ? (int) $productSelected : null;
        $guarantorProductTypes = $guarantor?->guarantorToProductTypes->where('product_id', $productSelected)->values();
        $guarantorProductTypeSelected = $request->get('guarantor_to_product_type_id');
        $guarantorProductTypeSelected = $guarantorProductTypeSelected ? (int) $guarantorProductTypeSelected : null;

        return [
            'guarantors' => $guarantors,
            'guarantorSelected' => (int) $guarantorSelected,
            'products' => $products,
            'productSelected' => (int) $productSelected,
            'guarantorProductTypes' => $guarantorProductTypes,
            'guarantorProductTypeSelected' => (int) $guarantorProductTypeSelected,
        ];
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $data = $this->getGuarantorData($request);

        $documentFormats = DocumentFormat::search($request->get('search'))
            ->query(function ($query) use ($data) {
                $query
                    ->when($data['guarantorSelected'], function ($query, $guarantorSelected) {
                        $query->where('guarantor_id', $guarantorSelected);
                    })
                    ->when($data['productSelected'], function ($query, $productSelected) {
                        $query->where('product_id', $productSelected);
                    })->when($data['guarantorProductTypeSelected'], function ($query, $guarantorProductTypeSelected) {
                        $query->where('guarantor_to_product_type_id', $guarantorProductTypeSelected);
                    });
            })
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resourceDocumentFormats = DocumentFormatResource::collection($documentFormats);
        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Format Dokumen',
            ],
            ...$data,
            'documentFormats' => fn () => $resourceDocumentFormats,
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
        // dd($request->all());
        $request->validate([
            'guarantor_id' => 'nullable|integer',
            'product_id' => 'required_with:guarantor_to_product_type_id|nullable|integer',
            'guarantor_to_product_type_id' => 'nullable|integer',
            'name' => 'required|string',
            'format_document' => 'required|string',
        ]);

        try {
            DB::beginTransaction();
            $guarantor_id = $request->get('guarantor_id') ?? null;
            $product_id = $request->get('product_id') ?? null;
            $guarantor_product_type_id = $request->get('guarantor_to_product_type_id') ?? null;

            DocumentFormat::create([
                'guarantor_id' => $guarantor_id,
                'product_id' => $product_id,
                'guarantor_to_product_type_id' => $guarantor_product_type_id,
                'name' => $request->get('name'),
                'format_document' => $request->get('format_document'),
            ]);

            DB::commit();

            activity()
                ->useLog('dokumen-format')
                ->performedOn(new DocumentFormat)
                ->causedBy(auth()->user())
                ->log('menambahkan format dokumen');

            return redirect()->back()->with('success', 'Berhasil menyimpan data')->withInput([
                'guarantorSelected' => $guarantor_id,
                'productSelected' => $product_id,
                'guarantorProductTypeSelected' => $guarantor_product_type_id,
            ]);
        } catch (Exception $e) {
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
        $request = request();

        // Menggabungkan parameter bawaan dengan data dari $documentFormat
        $mergedRequest = $request->merge([
            'guarantor_id' => $documentFormat->guarantor_id,
            'guarantor_product_id' => $documentFormat->product_id,
            'guarantor_to_product_type_id' => $documentFormat->guarantor_to_product_type_id,
        ]);

        // Mendapatkan data guarantor berdasarkan request yang telah digabungkan
        $data = $this->getGuarantorData($mergedRequest);

        // Menentukan komponen yang akan digunakan di Inertia
        $component = str_replace('/'.$documentFormat->getAttribute('id'), '', $request->path()).'/index';

        // Mengembalikan respons dengan Inertia
        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Format Dokumen',
            ],
            ...$data, // Memasukkan data guarantor yang telah diproses
            'documentFormat' => $documentFormat,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, DocumentFormat $documentFormat)
    {

        // dd($request->all());
        $request->validate([
            'guarantor_id' => 'nullable|integer',
            'product_id' => 'nullable|integer',
            'guarantor_to_product_type_id' => 'nullable|integer',
            'name' => 'required|string',
            'format_document' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $documentFormat->update([
                'name' => $request->get('name'),
                'format_document' => $request->get('format_document'),
                'product_id' => $request->get('product_id'),
                'guarantor_to_product_type_id' => $request->get('guarantor_to_product_type_id'),
                'guarantor_id' => $request->get('guarantor_id'),
            ]);

            DB::commit();

            activity()
                ->useLog('dokumen-format')
                ->performedOn($documentFormat)
                ->causedBy(auth()->user())
                ->log('mengubah format dokumen');

            return redirect()->back()->with('success', 'Berhasil menyimpan data')->withInput([
                'guarantorSelected' => $request->get('guarantor_id'),
                'productSelected' => $request->get('product_id'),
                'guarantorProductTypeSelected' => $request->get('guarantor_to_product_type_id'),
            ]);
        } catch (Exception $e) {
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
                ->useLog('dokumen-format')
                ->performedOn($documentFormat)
                ->causedBy(auth()->user())
                ->log('menghapus format dokumen');

            return redirect()->back()->with('success', 'Berhasil menghapus data');
        } catch (Exception $e) {
            flashMessage('Gagal', 'Gagal menghapus data', 'error');
            Log::error('Error delete format document', ['error' => $e->getMessage()]);

            return redirect()->back()->withErrors('Gagal menghapus data');
        }
    }

    public function getFormattedCreatedAtAttribute()
    {
        return Carbon::parse($this->attributes['created_at'])->translatedFormat('d F Y');
    }
}
