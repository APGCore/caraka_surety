<?php

namespace App\Http\Controllers\Guarantor;

use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\Branch\StoreRequest;
use App\Http\Resources\Guarantor\GuarantorResource;
use App\Models\Guarantor\Guarantor;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class BranchGuarantorController extends Controller
{
    protected string $component;

    public function __construct()
    {
        $this->component = 'admin/guarantor-management/branch-guarantor/';
    }

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
                        'head',
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
        $component = $this->component.'index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Data Cabang '.$guarantor->getAttribute('name'),
            ],
            'guarantor' => fn () => $guarantor,
            'branchGuarantors' => fn () => $resource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Guarantor $guarantor): Response
    {
        $component = $this->component.'create/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tambah Cabang Asuransi',
            ],
            'guarantor' => fn () => $guarantor,
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
                ->create($requestValid);

            activity()
                ->useLog('branch-guarantor')
                ->performedOn($guarantor)
                ->causedBy(auth()->user())
                ->log('Menambahkan data cabang asuransi');
            flashMessage('Berhasil', 'Penambahan data cabang asuransi berhasil');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Penambahan data cabang asuransi gagal', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('GuarantorController@store: ', $error);
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Guarantor $branchGuarantor): Response
    {
        $picture = $branchGuarantor->getAttribute('picture') ?
          Storage::url($branchGuarantor->getAttribute('picture')) : '';
        $branchGuarantor->setAttribute('picture', $picture);
        $branchGuarantor->load(['pattern', 'head']);

        $component = $this->component.'edit/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Cabang Asuransi',
            ],
            'branchGuarantor' => fn () => $branchGuarantor,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreRequest $request, Guarantor $branchGuarantor): void
    {
        try {
            DB::beginTransaction();

            $requestValid = $request->validated();
            if ($request->hasFile('upload_picture')) {
                $picture = $branchGuarantor->getAttribute('picture') ?? null;
                if ($picture) {
                    $this->deleteFile($picture);
                }

                $fileName = 'guarantor_'.str_replace(' ', '_', $requestValid['name']);
                $requestValid['picture'] = $this->uploadFile($request->file('upload_picture'), 'guarantors', $fileName);
            }

            $branchGuarantor->update($requestValid);

            activity()
                ->useLog('branch-guarantor')
                ->performedOn($branchGuarantor)
                ->causedBy(auth()->user())
                ->log('Mengubah data cabang asuransi');
            flashMessage('Berhasil', 'Perubahan data cabang asuransi berhasil');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('GuarantorController@update: ', $error);
            flashMessage('Gagal', 'Perubahan data cabang asuransi gagal', 'error');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Guarantor $branchGuarantor)
    {
        try {
            DB::beginTransaction();
            $picture = $branchGuarantor->getAttribute('picture') ?? '';
            $this->deleteFile($picture);
            $branchGuarantor->delete();

            activity()
                ->useLog('branch-guarantor')
                ->performedOn($branchGuarantor)
                ->causedBy(auth()->user())
                ->log('Menghapus data cabang asuransi');
            flashMessage('Berhasil', 'Data cabang asuransi berhasil dihapus');
            DB::commit();

            return back();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Data cabang asuransi gagal dihapus', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('GuarantorController@destroy: ', $error);

            return back()->withErrors($e->getMessage());
        }
    }
}
