<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\OfficeType;
use App\Enums\RoleEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\Guarantor\BlankResource;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Profile\Profile;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DistributionOfBlankController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if ($request->user()->hasRole(RoleEnum::StaffOperasional->value)) {
            $component = 'staff-operasional/blank-management/distribution-of-blank/index';
        } else {
            $component = 'admin/blank-management/distribution-of-blank/index';
        }

        $guarantors = Guarantor::with('head')
            ->get()->each(fn ($guarantor) => $guarantor->name);
        $guarantorHead = $guarantors->whereNull('headquarter_id')->values();
        $guarantorBranches = $guarantors->whereNotNull('headquarter_id')->values();
        $guarantorSelected = $request->get('guarantor_id', $guarantorHead->first()?->getAttribute('id'));
        $guarantorBranchSelected = $request->get('guarantor_branch_id', $guarantorBranches->first()?->getAttribute('id'));
        $officeTypes = OfficeType::getName();
        $officeTypeSelected = $request->get('office_type', $officeTypes[0]);
        $officeType = match ($officeTypeSelected) {
            'Kantor Cabang' => OfficeType::BRANCH->value,
            'Mitra Agen' => OfficeType::AGENT_PARTNER->value,
            'Mitra Pemasaran' => OfficeType::MARKETING_PARTNER->value,
            default => OfficeType::HEADQUARTER->value,
        };
        $offices = Profile::query()->where('office_type', $officeType)->get();
        $officeSelected = (int) ($request->get('office_id') ?? $offices->first()?->getAttribute('id'));
        $isAddBlank = $request->get('is_add_blank') === 'true';
        $picked = $request->get('picked');

        $blanks = $offices->isNotEmpty()
          ? Blank::search($request->get('search'))
              ->query(function ($query) use ($guarantorSelected, $guarantorBranchSelected, $officeSelected, $isAddBlank, $picked) {
                  $query
                      ->with('fromProfile')
                      ->where('guarantor_id', $guarantorSelected)
                      ->when($guarantorBranchSelected, function ($query) use ($guarantorBranchSelected) {
                          $query->where('guarantor_branch_id', $guarantorBranchSelected);
                      })
                      ->when($isAddBlank, function ($query) {
                          $query->whereNull('profile_id')
                              ->where('is_picked', false);
                      })
                      ->when(! $isAddBlank, function ($query) use ($officeSelected) {
                          $query->where('profile_id', $officeSelected);
                      })
                      ->when($picked === 'true', function ($query) {
                          $query->where('is_picked', true);
                      })
                      ->when($picked === 'false', function ($query) {
                          $query->where('is_picked', false);
                      });
              })
              ->orderBy('id')
              ->paginate($request->get('per_page') ?? 10)
              ->appends('query', null)
              ->appends($request->all())
          : collect();
        $blankResource = BlankResource::collection($blanks);

        return inertia($component, [
            'page_settings' => [
                'title' => 'Daftar Blangko',
            ],
            'guarantors' => $guarantorHead,
            'guarantorBranches' => $guarantorBranches,
            'guarantorSelected' => (int) $guarantorSelected,
            'guarantorBranchSelected' => (int) $guarantorBranchSelected,
            'offices' => $offices,
            'officeTypes' => $officeTypes,
            'officeSelected' => $officeSelected,
            'officeTypeSelected' => $officeTypeSelected,
            'blanks' => fn () => $blankResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $requestValid = $request->validate([
            'blank_ids.*' => 'required|integer|exists:'.Blank::class.',id',
            'office_id' => 'required|exists:'.Profile::class.',id',
        ]);

        try {
            DB::beginTransaction();

            Blank::query()
                ->whereIn('id', $requestValid['blank_ids'])
                ->update([
                    'profile_id' => $requestValid['office_id'],
                ]);

            activity()
                ->useLog('distribution-of-blank')
                ->performedOn(new Blank)
                ->causedBy(auth()->user())
                ->log('Daftar blangko');
            flashMessage('Berhasil', 'Data berhasil disimpan');
            DB::commit();

            return redirect()->route('blank-management.distribution-of-blank.index', ['office_id', $requestValid['office_id']]);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error on DistributionOfBlankController@store: ', $error);
            flashMessage('Gagal', 'Gagal menyimpan data', 'error');

            return back()->withErrors(['errors' => 'Gagal menyimpan data']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blank $blank)
    {
        try {
            DB::beginTransaction();
            $guarantorId = $blank->getAttribute('guarantor_id');
            $profileId = $blank->getAttribute('profile_id');
            if ($blank->getAttribute('is_picked')) {
                flashMessage('Gagal', 'Blangko sudah digunakan', 'error');

                return back()->withErrors(['errors' => 'Blangko sudah digunakan']);
            }
            $blank->update([
                'profile_id' => null,
            ]);

            flashMessage('Berhasil', 'Data berhasil dihapus');
            DB::commit();

            return redirect()->route('blank-management.distribution-of-blank.index', [
                'guarantor_id' => $guarantorId,
                'office_id' => $profileId,
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error on DistributionOfBlankController@destroy: ', $error);
            flashMessage('Gagal', 'Gagal menghapus data', 'error');

            return back()->withErrors(['errors' => 'Gagal menghapus data']);
        }
    }

    public function getBlankDistributed(Request $request): JsonResponse
    {
        $blanks = Blank::query()
            ->where('guarantor_id', $request->get('guarantor_id'))
            ->where('profile_id', $request->get('profile_id'))
            ->where('is_picked', false)
            ->orderBy('number')
            ->get();

        return $this->responseSuccess('Data berhasil diambil', $blanks);
    }

    public function getBlankRange(Request $request): JsonResponse
    {
        $blanks = Blank::query()
            ->whereNull('profile_id')
            ->where('is_picked', false)
            ->when($request->get('guarantor_id'), function ($query) use ($request) {
                $query->where('guarantor_id', $request->get('guarantor_id'));
            })
            ->orderBy('number')
            ->get();

        return $this->responseSuccess('Data berhasil diambil', $blanks);
    }

    public function storeTransfer(Request $request)
    {
        $requestValid = $request->validate([
            'blank_ids.*' => 'required|integer|exists:'.Blank::class.',id',
            'office_id' => 'required|exists:'.Profile::class.',id',
            'from_office_id' => 'required|exists:'.Profile::class.',id',
        ]);

        try {
            DB::beginTransaction();

            Blank::query()
                ->whereIn('id', $requestValid['blank_ids'])
                ->update([
                    'profile_id' => $requestValid['office_id'],
                    'from_profile_id' => $requestValid['from_office_id'],
                    'is_approved' => false,
                ]);

            activity()
                ->useLog('transfer-blank')
                ->performedOn(new Blank)
                ->causedBy(auth()->user())
                ->log('Transfer blangko');
            flashMessage('Berhasil', 'Data berhasil di transfer');
            DB::commit();

            return back();
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error on DistributionOfBlankController@storeTransfer: ', $error);
            flashMessage('Gagal', 'Gagal transfer data', 'error');

            return back()->withErrors(['errors' => 'Gagal transfer data']);
        }
    }

    public function getBlankUnused(Request $request): JsonResponse
    {
        $blanks = Blank::query()
            ->when($request->get('guarantor_id'), function ($query) use ($request) {
                $query->where('guarantor_id', $request->get('guarantor_id'));
            })
            ->when($request->get('guarantor_branch_id'), function ($query) use ($request) {
                $query->where('guarantor_branch_id', $request->get('guarantor_branch_id'));
            })
            ->where('is_picked', false)
            ->orderBy('number')
            ->get();

        return $this->responseSuccess('Data berhasil diambil', $blanks);
    }

    public function changeGuarantorBranch(Request $request): RedirectResponse
    {
        $request->validate([
            'guarantor_branch_id' => 'required|exists:'.Guarantor::class.',id',
            'blank_ids.*' => 'required|exists:'.Blank::class.',id',
        ]);
        try {
            DB::beginTransaction();

            Blank::query()
                ->whereIn('id', $request->get('blank_ids'))
                ->update([
                    'guarantor_branch_id' => $request->get('guarantor_branch_id'),
                ]);

            activity()
                ->useLog('change-guarantor-branch')
                ->performedOn(new Blank)
                ->causedBy(auth()->user())
                ->log('Ubah cabang blangko');
            flashMessage('Berhasil', 'Data berhasil diubah');
            DB::commit();

            return back();
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error on DistributionOfBlankController@changeGuarantorBarch: ', $error);
            flashMessage('Gagal', 'Gagal mengubah data', 'error');

            return back()->withErrors(['errors' => 'Gagal mengubah data']);
        }
    }
}
