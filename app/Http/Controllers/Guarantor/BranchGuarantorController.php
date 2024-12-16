<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\StoreRequest;
use App\Http\Requests\Guarantor\UpdateRequest;
use App\Http\Resources\Guarantor\GuarantorResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Product\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class BranchGuarantorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Guarantor $guarantor)
    {
        $guarantors = Guarantor::search($request->get('search'))
            ->query(function ($query) use ($guarantor) {
                return $query
                    ->where('headquarter_id', $guarantor->getAttribute('id'))
                    ->with([
                        'province',
                        'regency',
                        'district',
                    ]);
            })
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = GuarantorResource::collection($guarantors);
        $component = str_replace('/'.$guarantor->getAttribute('id'), '', request()->path()).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Data Cabang Asuransi',
            ],
            'guarantors' => fn () => $resource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): \Inertia\Response
    {
        $component = request()->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Asuransi',
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): void
    {
        try {
            DB::beginTransaction();

            $requestValid = $request->validated();
            if ($request->hasFile('upload_picture')) {
                $fileName = 'guarantor_'.str_replace(' ', '_', $requestValid['name']);
                $path = $this->uploadFile($request->file('upload_picture'), 'guarantors', $fileName);
                $requestValid['picture'] = $path;
            }

            $guarantor = Guarantor::query()
                ->create($requestValid)
                ->load('pattern');

            $guarantor->pattern()->create([
                'prefix' => $requestValid['prefix'],
                'content' => $requestValid['content'],
                'suffix' => $requestValid['suffix'],
            ]);

            activity()
                ->performedOn($guarantor)
                ->causedBy(auth()->user())
                ->log('Menambahkan data asuransi');
            flashMessage('Berhasil', 'Penambahan data asuransi berhasil');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Penambahan data asuransi gagal', 'error');
            Log::error('GuarantorController@store: ', ['message' => $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Guarantor $guarantor)
    {
        $picture = $guarantor->getAttribute('picture') ?
            Storage::url($guarantor->getAttribute('picture')) : '';
        $guarantor->setAttribute('picture', $picture);
        $guarantor->load('pattern');

        $component = str_replace('/'.$guarantor->getAttribute('id'), '', request()->path()).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Asuransi',
            ],
            'guarantor' => fn () => $guarantor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Guarantor $guarantor): void
    {
        try {
            DB::beginTransaction();

            $requestValid = $request->validated();
            if ($request->hasFile('upload_picture')) {
                $picture = $guarantor->getAttribute('picture') ?? null;
                if ($picture) {
                    $this->deleteFile($picture);
                }

                $fileName = 'guarantor_'.str_replace(' ', '_', $requestValid['name']);
                $requestValid['picture'] = $this->uploadFile($request->file('upload_picture'), 'guarantors', $fileName);
            }

            $guarantor->update($requestValid);
            $guarantor->load('pattern');

            $patternData = [
                'prefix' => $requestValid['prefix'],
                'content' => $requestValid['content'],
                'suffix' => $requestValid['suffix'],
            ];

            if ($guarantor->pattern === null) {
                $guarantor->pattern()->create($patternData);
            } else {
                $guarantor->pattern->update($patternData);
            }

            activity()
                ->performedOn($guarantor)
                ->causedBy(auth()->user())
                ->log('Mengubah data asuransi');
            flashMessage('Berhasil', 'Perubahan data asuransi berhasil');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('GuarantorController@update: ', ['message' => $e->getMessage()]);
            flashMessage('Gagal', 'Perubahan data asuransi gagal', 'error');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guarantor $guarantor)
    {
        try {
            DB::beginTransaction();
            $picture = $guarantor->getAttribute('picture') ?? '';
            $this->deleteFile($picture);
            $guarantor->delete();

            activity()
                ->performedOn($guarantor)
                ->causedBy(auth()->user())
                ->log('Menghapus data asuransi');
            flashMessage('Berhasil', 'Data asuransi berhasil dihapus');
            DB::commit();

            return redirect()->route('guarantor.index');
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Data asuransi gagal dihapus', 'error');
            Log::error('GuarantorController@destroy: ', ['message' => $e->getMessage()]);

            return back()->withErrors($e->getMessage());
        }
    }

    public function getAll()
    {
        $guarantors = Guarantor::query()
            ->orderBy('name')
            ->get();

        return $this->responseSuccess('Berhasil mengambil data penjamin', $guarantors);
    }

    public function product(Guarantor $guarantor)
    {
        $guarantor->load('product:id,name');

        // unique product
        $product = $guarantor->product->unique('id');

        return $this->responseSuccess('Berhasil mengambil data produk', $product);
    }

    public function productType(Guarantor $guarantor, Product $product)
    {
        $guarantorProductType = GuarantorToProductType::query()
            ->where('guarantor_id', $guarantor->getAttribute('id'))
            ->where('product_id', $product->getAttribute('id'))
            ->get(['id', 'code', 'name', 'job_group', 'full_name']);

        return $this->responseSuccess('Berhasil mengambil data produk asuransi', $guarantorProductType);
    }

    public function getGuarantorByProductId(Product $product)
    {
        $guarantors = GuarantorToProductType::query()
            ->where('product_id', $product->id)
            ->get(['guarantor_id']);

        $guaratorIds = $guarantors->pluck('guarantor_id')->unique();

        $guarantors = Guarantor::whereIn('id', $guaratorIds)->get();

        return $this->responseSuccess('Berhasil mengambil data penjamin', $guarantors);
    }
}
