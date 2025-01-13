<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Resources\Office\EmployeeResource;
use App\Models\Guarantor\EmployeeLimit;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeLimitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::query()
            ->whereNull('headquarter_id')
            ->get(['id', 'name']);
        $guarantorSelected = (int) ($request->get('guarantor_id') ?? $guarantors->first()?->id);
        $guarantorToProductTypes = $guarantors->find($guarantorSelected)?->load(['guarantorToProductTypes.product', 'guarantorToProductTypes.productType'])->guarantorToProductTypes;

        $guarantorProducts = $guarantorToProductTypes?->pluck('product')->unique()->values();
        $guarantorProductSelected = (int) ($request->get('guarantor_product_id') ?? $guarantorProducts->first()?->id);

        $guarantorProductTypes = $guarantorToProductTypes?->where('product_id', $guarantorProductSelected)->pluck('productType')->unique()->values();
        $guarantorProductTypeSelected = (int) ($request->get('guarantor_product_type_id') ?? $guarantorProductTypes->first()?->id);

        $jobGroups = $guarantorToProductTypes?->where('product_id', $guarantorProductSelected)->where('product_type_id', $guarantorProductTypeSelected)->pluck('job_group')->unique()->values();
        $jobGroupSelected = $request->get('job_group') ?? $jobGroups->first();

        $jobTypes = $guarantorToProductTypes?->where('product_id', $guarantorProductSelected)->where('product_type_id', $guarantorProductTypeSelected)->where('job_group', $jobGroupSelected)->pluck('job_type')->unique()->values();
        $jobTypeSelected = $request->get('job_type') ?? $jobTypes->first();

        $guarantorToProductTypeId = $guarantorToProductTypes?->where('product_id', $guarantorProductSelected)->where('product_type_id', $guarantorProductTypeSelected)->where('job_group', $jobGroupSelected)->where('job_type', $jobTypeSelected)->value('id');

        $officeTypes = ['Kantor Pusat', 'Kantor Cabang', 'Mitra Agen', 'Mitra Pemasaran'];
        $officeTypeSelected = $request->get('office_type', $officeTypes[0]);
        $officeType = match ($officeTypeSelected) {
            'Kantor Cabang' => OfficeType::BRANCH->value,
            'Mitra Agen' => OfficeType::AGENT_PARTNER->value,
            'Mitra Pemasaran' => OfficeType::MARKETING_PARTNER->value,
            default => OfficeType::HEADQUARTER->value,
        };
        $profiles = Profile::where('office_type', $officeType)->get();
        $profileSelected = (int) ($request->get('profile_id') ?? $profiles->first()?->id);

        $limit = ProfileLimit::query()
            ->where('guarantor_id', $guarantorSelected)
            ->where('guarantor_to_product_type_id', $guarantorToProductTypeId)
            ->where('profile_id', $profileSelected)
            ->first();

        $employees = User::search($request->get('search'))
            ->query(function (Builder $query) use ($guarantorSelected, $guarantorToProductTypeId, $profileSelected) {
                return $query->whereIn('role_id', [2, 3, 4])
                    ->where('profile_id', $profileSelected)
                    ->with('role')
                    ->when($guarantorSelected && $profileSelected, function ($query) use ($guarantorSelected, $guarantorToProductTypeId, $profileSelected) {
                        $query->with(['employeeLimit' => function ($query) use ($guarantorSelected, $guarantorToProductTypeId, $profileSelected) {
                            $query->where('guarantor_id', $guarantorSelected)
                                ->where('guarantor_to_product_type_id', $guarantorToProductTypeId)
                                ->where('profile_id', $profileSelected);
                        }]);
                    });
            })
            ->orderBy('id')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $employeeResource = EmployeeResource::collection($employees);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Pembagian Limit per Pengguna',
            ],
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'guarantorProducts' => $guarantorProducts,
            'guarantorProductSelected' => $guarantorProductSelected,
            'guarantorProductTypes' => $guarantorProductTypes,
            'guarantorProductTypeSelected' => $guarantorProductTypeSelected,
            'guarantorToProductTypeId' => $guarantorToProductTypeId,
            'jobGroups' => $jobGroups,
            'jobGroupSelected' => $jobGroupSelected,
            'jobTypes' => $jobTypes,
            'jobTypeSelected' => $jobTypeSelected,
            'profiles' => $profiles,
            'profileSelected' => $profileSelected,
            'officeTypes' => $officeTypes,
            'officeTypeSelected' => $officeTypeSelected,
            'limit' => $limit,
            'employees' => fn () => $employeeResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $requestValid = $request->validate(
            [
                'guarantor_id' => 'required|exists:'.Guarantor::class.',id',
                'guarantor_to_product_type_id' => 'required|exists:'.GuarantorToProductType::class.',id',
                'profile_id' => 'required|exists:'.Profile::class.',id',
                'employee_id' => 'required|exists:'.User::class.',id',
                'limit' => 'required',
            ],
            [
                'guarantor_id.required' => 'Kantor belum dipilih',
                'guarantor_to_product_type_id.required' => 'Produk belum dipilih',
                'profile_id.required' => 'Profil belum dipilih',
                'employee_id.required' => 'Pengguna belum dipilih',
                'limit.required' => 'Limit wajib diisi',
            ]
        );

        try {
            DB::beginTransaction();
            $profileLimit = ProfileLimit::query()
                ->where('guarantor_id', $requestValid['guarantor_id'])
                ->where('guarantor_to_product_type_id', $requestValid['guarantor_to_product_type_id'])
                ->where('profile_id', $requestValid['profile_id'])
                ->first();
            $limit = (int) str_replace('.', '', $requestValid['limit']);

            if ($limit > $profileLimit->getAttribute('limit')) {
                throw new \Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            EmployeeLimit::query()->create(
                [
                    ...$requestValid,
                    'limit' => $limit,
                ]
            );

            activity()
                ->useLog('employee-limit')
                ->performedOn(new EmployeeLimit)
                ->causedBy(auth()->user())
                ->log('Menambahkan limit pengguna baru');
            DB::commit();

            return $this->responseSuccess('Berhasil menambahkan limit pengguna');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error store profile limit', ['error' => $e->getMessage()]);

            return $this->responseError('Gagal menambahkan limit pengguna', ['message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EmployeeLimit $employeeLimit): JsonResponse
    {
        $requestValid = $request->validate(
            ['limit' => 'required'],
            ['limit.required' => 'Limit wajib diisi']);

        try {
            DB::beginTransaction();

            $profileLimit = ProfileLimit::query()
                ->where('guarantor_id', $employeeLimit->getAttribute('guarantor_id'))
                ->where('profile_id', $employeeLimit->getAttribute('profile_id'))
                ->first();

            $limit = (int) str_replace('.', '', $requestValid['limit']);

            if ($limit > $profileLimit->getAttribute('limit')) {
                throw new \Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            $updated = $employeeLimit->update(
                [
                    'limit' => $limit,
                ]
            );
            if (! $updated) {
                throw new \Exception('Gagal mengubah limit pengguna');
            }

            DB::commit();

            return $this->responseSuccess('Berhasil mengubah limit pengguna');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error update profile limit', ['error' => $e->getMessage()]);

            return $this->responseError('Gagal mengubah limit pengguna', ['message' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EmployeeLimit $employeeLimit): void
    {
        try {
            DB::beginTransaction();

            $deleted = $employeeLimit->delete();
            if (! $deleted) {
                throw new \Exception('Gagal menghapus limit pengguna');
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error delete profile limit', ['error' => $e->getMessage()]);
        }
    }
}
