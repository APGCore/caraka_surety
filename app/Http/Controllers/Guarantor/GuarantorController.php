<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\StoreRequest;
use App\Http\Requests\Guarantor\UpdateRequest;
use App\Http\Resources\Guarantor\GuarantorResource;
use App\Models\Guarantor\Guarantor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GuarantorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::search($request->get('search'))
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = GuarantorResource::collection($guarantors);
        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Data Asuransi',
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
                $path = $request->file('upload_picture')->store('guarantors', 'public');
                $requestValid['picture'] = $path;
            }

            Guarantor::query()
                ->create($requestValid);

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
                $picture = $guarantor->getAttribute('picture') ?? '';
                if (Storage::exists($picture)) {
                    Storage::delete($picture);
                }
                $requestValid['picture'] = $request->file('upload_picture')->store('guarantors', 'public');
            }

            $guarantor->update($requestValid);

            flashMessage('Berhasil', 'Perubahan data asuransi berhasil');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Perubahan data asuransi gagal', 'error');
            Log::error('GuarantorController@update: ', ['message' => $e->getMessage()]);
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
            if (Storage::exists($picture)) {
                Storage::delete($picture);
            }
            $guarantor->delete();

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
}
