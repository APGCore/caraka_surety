<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Blank\AccBlanksRequest;
use App\Http\Requests\Blank\StoreMultiRequest;
use App\Http\Requests\Blank\StoreRequest;
use App\Http\Requests\Blank\UpdateRequest;
use App\Http\Resources\Guarantor\BlankResource;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class BlankController extends Controller
{
    protected object $links;

    public function __construct()
    {
        $this->links = collect([
            'index' => 'blank-management.blank.index',
            'store' => 'blank-management.blank.store',
            'update' => 'blank-management.blank.update',
            'destroy' => 'blank-management.blank.destroy',
            'storeMulti' => 'blank-management.blank.store.multi',
            'approve' => 'blank-management.blank.approve',
        ]);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        if ($request->user()->hasRole(RoleEnum::StaffOperasional->value)) {
            $component = 'staff-operasional/blank-management/blank/index';
        } else {
            $component = 'admin/blank-management/blank/index';
        }

        $guarantors = Guarantor::with('head')
            ->get();
        $guarantorHead = $guarantors->whereNull('headquarter_id')->values();
        $guarantorBranches = $guarantors->whereNotNull('headquarter_id')->values();
        $guarantorSelected = $request->get('guarantor_id', config('guarantor.id'));
        $guarantorBranchSelected = $request->get('guarantor_branch_id');

        $blanks = Blank::search($request->get('search'))
            ->query(function ($query) use ($guarantorBranchSelected, $guarantorSelected) {
                return $query->with(['guarantorBranch', 'profile'])
                    ->where('guarantor_id', ($guarantorSelected))
                    ->when($guarantorBranchSelected != null, function ($query) use ($guarantorBranchSelected) {
                        return $query->where('guarantor_branch_id', $guarantorBranchSelected);
                    });
            })
            ->orderBy('number')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query')
            ->appends($request->all());
        $blankResource = BlankResource::collection($blanks);

        return inertia($component, [
            'page_settings' => [
                'title' => 'Penerimaan Blangko',
            ],
            'guarantors' => $guarantorHead,
            'guarantorBranches' => $guarantorBranches,
            'guarantorSelected' => (int) $guarantorSelected,
            'guarantorBranchSelected' => (int) $guarantorBranchSelected,
            'blanks' => fn () => $blankResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request): JsonResponse
    {
        $requestValidated = $request->validated();
        DB::beginTransaction();
        try {
            Blank::query()
                ->create($requestValidated);

            DB::commit();
            activity()
                ->useLog('blank')
                ->performedOn(new Blank)
                ->causedBy(auth()->user())
                ->log('Menambahkan blangko baru');

            return $this->responseSuccess('Blangko berhasil ditambahkan');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error store blank', $error);

            return $this->responseError('Blangko gagal ditambahkan', $error);
        }
    }

    /**
     * Store Multi Blanks
     */
    public function storeMulti(StoreMultiRequest $request): JsonResponse
    {
        $requestValidated = $request->validated();

        try {
            DB::beginTransaction();
            $start = $requestValidated['number_start'];
            $startLength = strlen($start);
            $end = $requestValidated['number_end'];
            $endLength = strlen($end);

            $diff = (int) $end - (int) $start;

            $data = array_map(fn ($i) => [
                'guarantor_id' => $requestValidated['guarantor_id'],
                'guarantor_branch_id' => $requestValidated['guarantor_branch_id'],
                'number' => str_pad($start + $i, max($startLength, $endLength), '0', STR_PAD_LEFT),
                'created_at' => now(),
                'updated_at' => now(),
            ], range(0, max($diff, 0)));

            Blank::query()->insert($data);

            DB::commit();
            activity()
                ->useLog('blank')
                ->performedOn(new Blank)
                ->causedBy(auth()->user())
                ->log('Menambahkan blangko baru');

            return $this->responseSuccess('Blangko berhasil ditambahkan', 'Blangko berhasil ditambahkan');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error store multi blank', $error);

            return $this->responseError('Blangko gagal ditambahkan', $error);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blank $blank): void
    {
        DB::beginTransaction();
        try {
            if ($blank->getAttribute('is_used') || $blank->getAttribute('profile_id')) {
                throw new Exception('Blangko sudah digunakan', 400);
            }
            $blank->delete();

            activity()
                ->useLog('blank')
                ->performedOn($blank)
                ->causedBy(auth()->user())
                ->log('Menghapus blangko dengan nomor '.$blank->getAttribute('number'));
            flashMessage('Berhasil', 'Blangko berhasil dihapus');
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error destroy blank', $error);
            if ($e->getCode() === 400) {
                flashMessage('Gagal', $e->getMessage(), 'error');
            } else {
                flashMessage('Gagal', 'Blangko gagal dihapus', 'error');
            }
        }
    }

    public function getByOffice(Request $request): Response
    {
        $guarantors = Guarantor::query()
            ->whereNull('headquarter_id')->get();
        $guarantorBranches = Guarantor::query()
            ->whereNotNull('headquarter_id')->get();
        $guarantorId = $request->get('guarantor_id', config('guarantor.id'));
        $guarantorBranchId = $request->get('guarantor_branch_id');
        $profileId = $request->user()->profile_id;
        if ($request->user()->hasRole(RoleEnum::KepalaCabang->value)) {
            $links = $this->links->map(fn ($link) => 'kepala-cabang-'.$link);
        } elseif ($request->user()->hasRole(RoleEnum::KepalaAgentPartner->value)) {
            $links = $this->links->map(fn ($link) => 'kepala-agent-partner-'.$link);
        } else {
            $links = $this->links->map(fn ($link) => 'direksi-'.$link);
        }
        $component = 'blank-management/approval/index';

        $blanks = Blank::query()->where([
            'profile_id' => $profileId,
            'is_approved' => false,
        ])->get();

        $blankPage = Blank::search($request->get('search'))
            ->query(function ($query) use ($guarantorId, $guarantorBranchId, $profileId) {
                return $query->with(['profile', 'fromProfile'])
                    ->where('guarantor_id', $guarantorId)
                    ->when($guarantorBranchId != null, function ($query) use ($guarantorBranchId) {
                        return $query->where('guarantor_branch_id', $guarantorBranchId);
                    })
                    ->where('profile_id', $profileId);
            })
            ->orderBy('number')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query')
            ->appends($request->all());
        $blankResource = BlankResource::collection($blankPage);

        return inertia($component, [
            'page_settings' => [
                'title' => 'Kelola Blangko',
            ],
            'blanks' => fn () => $blankResource,
            'blanks_un_approved' => $blanks,
            'links' => $links ?? null,
            'guarantors' => $guarantors,
            'guarantorBranches' => $guarantorBranches,
            'guarantorSelected' => (int) $guarantorId,
            'guarantorBranchSelected' => (int) $guarantorBranchId,
        ]);
    }

    public function approveBlanks(AccBlanksRequest $request): JsonResponse
    {
        $requestValidated = $request->validated();
        $blanks = collect($requestValidated['blanks']);
        $blanks = Blank::query()
            ->whereIn('id', $blanks->pluck('id')->values())
            ->get();
        DB::beginTransaction();
        try {
            $blanks->each(fn ($blank) => $blank->update(['is_approved' => true]));

            activity()
                ->useLog('blank')
                ->performedOn(new Blank)
                ->causedBy(auth()->user())
                ->log($request->user()->username.'Menerima blangko');

            DB::commit();

            return $this->responseSuccess('Blangko berhasil diterima');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error acc blanks', $error);

            return $this->responseError('Blangko gagal diterima', $error);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRequest $request, Blank $blank): JsonResponse
    {
        $requestValidated = $request->validated();
        DB::beginTransaction();
        try {
            if ($blank->getAttribute('is_picked') || $blank->getAttribute('profile_id')) {
                throw new Exception('Blangko sudah digunakan', 400);
            }
            $blank->update($requestValidated);

            activity()
                ->useLog('blank')
                ->performedOn($blank)
                ->causedBy(auth()->user())
                ->log('Mengubah blangko');
            DB::commit();

            return $this->responseSuccess('Blangko berhasil diubah');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error update blank', $error);

            if ($e->getCode() === 400) {
                return $this->responseError($e->getMessage(), $error);
            } else {
                return $this->responseError('Blangko gagal diubah', $error);
            }
        }
    }

    public function apiGetBlank(Request $request): JsonResponse
    {
        $exceptBlankId = $request->get('blank_id_for_edit');
        $guarantorId = session('guarantor_id', config('guarantor.id'));
        $guarantorBranchId = $request->get('guarantor_branch_id');
        $user = auth()->user();
        $isAdmin = $user->hasRole(RoleEnum::Admin->value);

        $blanks = Blank::query()
            ->where([
                'guarantor_id' => $guarantorId,
                ...(! $isAdmin ? ['profile_id' => $user->profile_id] : []),
                'is_revised' => false,
                'is_broken' => false,
                'is_approved' => true,
            ])
            ->where(function ($query) use ($exceptBlankId) {
                $query->where(['is_picked' => false, 'is_used' => false])
                    ->when($exceptBlankId != null, function ($query) use ($exceptBlankId) {
                        return $query->orWhere('id', $exceptBlankId);
                    });
            })
            ->when($guarantorBranchId != null, function ($query) use ($guarantorBranchId) {
                return $query->where(function ($query) use ($guarantorBranchId) {
                    $query->where('guarantor_branch_id', $guarantorBranchId)
                        ->orWhereNull('guarantor_branch_id');
                });
            })
            ->get(['id', 'guarantor_id', 'profile_id', 'number']);

        return $this->responseSuccess('Berhasil mengambil data blangko', $blanks);
    }
}
