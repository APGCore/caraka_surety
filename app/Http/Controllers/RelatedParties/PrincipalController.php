<?php

namespace App\Http\Controllers\RelatedParties;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Location\DistrictController;
use App\Http\Controllers\Location\RegencyController;
use App\Http\Requests\Principal\UpdateRequest;
use App\Http\Resources\Principal\PrincipalDocumentResource;
use App\Http\Resources\Principal\PrincipalResource;
use App\Models\Document\RequiredDoc;
use App\Models\Location\District;
use App\Models\Location\Province;
use App\Models\Location\Regency;
use App\Models\RelatedParties\Principal;
use Exception;
use Illuminate\Http\Exceptions\ThrottleRequestsException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class PrincipalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $principal = Principal::search($request->get('search'))
            ->orderBy('name')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $principalResource = PrincipalResource::collection($principal);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Principal',
            ],
            'principals' => fn () => $principalResource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function show(Principal $principal)
    {
        $principal = Principal::with('province', 'regency', 'district')->findOrFail($principal->id);

        return inertia('admin/principal-management/principal/detail/index', [
            'page_settings' => [
                'title' => 'Detail Principal',
            ],
            'principal' => $principal,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Principal $principal, Request $request)
    {
        $provinces = Province::query()->get();

        $regencies = collect();
        if ($request->get('province_id')) {
            $regenciesQuery = Regency::query();

            $regencies = $regenciesQuery->where('province_id', $request->get('province_id'))->get();
            if ($regencies->count() == 0) {
                $province = $provinces->where('id', $request->get('province_id'))->first();
                $regencyController = new RegencyController;
                $regencyController->synchronize($request->merge(['code' => $province->code]));
            }
            $regencies = $regenciesQuery->where('province_id', $request->get('province_id'))->get();
            $principal->setAttribute('province_id', (int) $request->get('province_id'));
        } elseif ($principal->province_id) {
            $regencies = Regency::query()
                ->where('province_id', $principal->province_id)
                ->get();
        }

        $districts = collect();
        if ($request->get('regency_id')) {
            $districtsQuery = District::query();

            $districts = $districtsQuery->where('regency_id', $request->get('regency_id'))->get();
            if ($districts->count() == 0) {
                $regency = $regencies->where('id', $request->get('regency_id'))->first();
                $districtController = new DistrictController;
                $districtController->synchronize($request->merge(['code' => $regency->code]));
            }
            $districts = $districtsQuery->where('regency_id', $request->get('regency_id'))->get();
            $principal->setAttribute('regency_id', (int) $request->get('regency_id'));
        } elseif ($principal->regency_id) {
            $districts = District::query()
                ->where('regency_id', $principal->regency_id)
                ->get();
        }

        if ($request->get('district_id')) {
            $principal->setAttribute('district_id', (int) $request->get('district_id'));
        }

        $component = $request->path();
        $component = substr($component, 0, strrpos($component, '/')).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Principal',
            ],
            'principal' => $principal,
            'provinces' => $provinces,
            'regencies' => $regencies,
            'districts' => $districts,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Principal $principal)
    {
        try {
            DB::beginTransaction();

            $principal->update($request->validated());
            activity()
                ->useLog('principal')
                ->performedOn($principal)
                ->causedBy(auth()->user())
                ->log('update data principal');
            flashMessage('Berhasil', 'Perubahan data principal berhasil');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Perubahan data principal gagal', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('PrincipalController@update: ', $error);
        } finally {
            return redirect()->route('principal.index');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Principal $principal)
    {
        try {
            DB::beginTransaction();

            if ($principal->exists) {
                $principal->delete();
            } else {
                throw new ThrottleRequestsException('Data Obligee tidak ditemukan');
            }
            activity()
                ->useLog('principal')
                ->performedOn($principal)
                ->causedBy(auth()->user())
                ->log('Menghapus data obligee');
            flashMessage('Data Obligee Dihapus', 'Data Obligee dihapus');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal Menghapus Kantor Cabang', 'Terjadi kesalahan saat menghapus kantor cabang', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Profil Destroy: ', $error);
        } finally {
            return redirect()->back();
        }
    }

    public function getAll()
    {
        $principals = Principal::query()
            ->with(['documents'])
            ->get();

        return $this->responseSuccess('Data Principal', $principals);
    }

    public function getDocument(Request $request)
    {
        $request->validate([
            'principal_id' => 'nullable|exists:'.Principal::class.',id,deleted_at,NULL',
        ]);

        $requiredDocuments = RequiredDoc::with(['principalDocument' => function ($query) use ($request) {
            $query->where([
                'principal_id' => $request->get('principal_id'),
                'is_approved' => true,
            ]);
        }])->get();

        $resource = PrincipalDocumentResource::collection($requiredDocuments);

        return $this->responseSuccess('Berhasil Mengambil Dokumen Principal', $resource);
    }

    public function getRatios($principalId)
    {
        $principal = Principal::query()
            ->with('principalRatios')
            ->firstWhere('id', $principalId);

        $ratios = $principal?->getRelation('principalRatios') ?? [];

        return $this->responseSuccess('Data Ratio', $ratios);
    }
}
