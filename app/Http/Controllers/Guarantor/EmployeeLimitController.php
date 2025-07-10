<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\JobType;
use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Resources\Office\EmployeeResource;
use App\Models\Guarantor\EmployeeLimit;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Profile\Profile;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EmployeeLimitController extends Controller
{
    public function apiSearch(Request $request): JsonResponse
    {
        // Selected Guarantor
        $guarantor_id = config('guarantor.id');

        // default job type Jastan to unconditional
        $job_type = JobType::UNCONDITIONAL->value;

        // request
        $search = $request->get('search') ?? '';
        $isPageAble = $request->get('is_page_able') ?? 'false';
        $perPage = $request->get('per_page') ?? 10;
        $page = $request->get('page') ?? 1;

        // filter for guarantor product type limit
        $product_id = $request->get('product_id') ?? null;
        $product_type_id = $request->get('product_type_id') ?? null;
        $job_group = $request->get('job_group') ?? null;
        $profile_id = $request->get('office_id') ?? null;

        // selected guarantor product type
        $guarantorProductType = GuarantorToProductType::query()
            ->with(['productType'])
            ->where('guarantor_id', $guarantor_id)
            ->where('product_id', $product_id)
            ->where('product_type_id', $product_type_id)
            ->where('job_group', $job_group)
            ->where('job_type', $job_type)
            ->first();

        $guarantorProductTypeId = $guarantorProductType?->id;
        $productTypeName = $guarantorProductType?->productType?->name;

        // profile Limit
        $profileLimit = ProfileLimit::query()
            ->where('guarantor_id', $guarantor_id)
            ->where('guarantor_to_product_type_id', $guarantorProductTypeId)
            ->where('profile_id', $profile_id)
            ->first();

        // employees
        $employees = User::search($search)
            ->query(function (Builder $query) use ($guarantor_id, $guarantorProductTypeId, $profile_id) {
                return $query->whereIn('role_id', [2, 3, 4])
                    ->where('profile_id', $profile_id)
                    ->with('role')
                    ->when($guarantor_id && $profile_id, function ($query) use ($guarantor_id, $guarantorProductTypeId, $profile_id) {
                        $query->with(['employeeLimit' => function ($query) use ($guarantor_id, $guarantorProductTypeId, $profile_id) {
                            $query->where('guarantor_id', $guarantor_id)
                                ->where('guarantor_to_product_type_id', $guarantorProductTypeId)
                                ->where('profile_id', $profile_id);
                        }]);
                    });
            })
            ->orderBy('created_at', 'desc');

        // if is page able is true, then paginate the data
        $employees = $isPageAble !== 'false'
          ? $employees->paginate(
              perPage: $perPage,
              page: $page
          )
          : $employees->get();

        // employee resource
        $employeeResource = EmployeeResource::collection($employees);

        $datas = [
            'employees' => $employeeResource,
            'profileLimit' => [
                ...($profileLimit?->toArray() ?? []),
                'product_type_name' => $productTypeName,
            ],
        ];

        if ($isPageAble !== 'false') {
            $meta = [
                'current_page' => $employees->currentPage(),
                'from' => $employees->firstItem(),
                'to' => $employees->lastItem(),
                'last_page' => $employees->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $employees->total(),
            ];
        }

        return $this->responseSuccess(message: 'Berhasil mengambil data limit karyawan', data: $datas, meta: $meta ?? null);
    }

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
            ->withQueryString()
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
    public function store(Request $request)
    {
        // $requestValid = $request->validate(
        //   [
        //     'guarantor_to_product_type_id' => 'required|exists:' . GuarantorToProductType::class . ',id',
        //     'profile_id' => 'required|exists:' . Profile::class . ',id',
        //     'employee_id' => 'required|exists:' . User::class . ',id',
        //     'limit' => 'required',
        //   ],
        //   [
        //     'guarantor_to_product_type_id.required' => 'Produk belum dipilih',
        //     'profile_id.required' => 'Profil belum dipilih',
        //     'employee_id.required' => 'Pengguna belum dipilih',
        //     'limit.required' => 'Limit wajib diisi',
        //   ]
        // );

        try {
            DB::beginTransaction();

            // Selected Guarantor
            $guarantor = Guarantor::first();
            $guarantor_id = $guarantor ? $guarantor->id : null;
            $job_type = JobType::UNCONDITIONAL->value;

            // filter for guarantor product type limit
            $product_id = $request->get('product_id') ?? null;
            $product_type_id = $request->get('product_type_id') ?? null;
            $job_group = $request->get('job_group') ?? null;
            $profile_id = $request->get('office_id') ?? null;
            $employee_id = $request->get('employee_id') ?? null;
            $request_limit = $request->get('limit') ?? null;
            $request_limit_inherit = $request->get('limit_inherit') ?? null;

            $guarantorProductType = GuarantorToProductType::query()
                ->with(['productType'])
                ->where('guarantor_id', $guarantor_id)
                ->where('product_id', $product_id)
                ->where('product_type_id', $product_type_id)
                ->where('job_group', $job_group)
                ->where('job_type', $job_type)
                ->first();

            $guarantorProductTypeId = $guarantorProductType?->id;

            $profileLimit = ProfileLimit::query()
                ->where('guarantor_id', $guarantor_id)
                ->where('guarantor_to_product_type_id', $guarantorProductTypeId)
                ->where('profile_id', $profile_id)
                ->first();

            $limit = (int) str_replace('.', '', $request_limit);
            $limit_inherit = (int) str_replace('.', '', $request_limit_inherit);

            if ($limit > $profileLimit->getAttribute('limit') || $limit_inherit > $profileLimit->getAttribute('limit_inherit')) {
                throw new Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            EmployeeLimit::query()->create(
                [
                    'guarantor_id' => $guarantor_id,
                    'guarantor_to_product_type_id' => $guarantorProductTypeId,
                    'profile_id' => $profile_id,
                    'employee_id' => $employee_id,
                    'limit' => $limit,
                    'limit_inherit' => $limit_inherit,
                ]
            );

            activity()
                ->useLog('employee-limit')
                ->performedOn(new EmployeeLimit)
                ->causedBy(auth()->user())
                ->log('Menambahkan limit pengguna baru');
            DB::commit();

            flashMessage('success', 'Limit pengguna berhasil ditambahkan');

            $params = $this->setParams(
                $product_id,
                $product_type_id,
                $job_group,
                $profile_id
            );

            return redirect()->route('employee-limit.index', $params);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error store profile limit', $error);

            return redirect()->back()->withErrors($error);
        }
    }

    private function setParams(
        ?int $productSelected,
        ?int $productTypeSelected,
        ?string $jobGroupSelected,
        ?int $officeSelected,
    ): array {
        $office = Profile::query()
            ->where('id', $officeSelected)
            ->first();
        $officeTypeSelected = $office->office_type ?? null;
        $officeType = match ($officeTypeSelected) {
            'Kantor Cabang' => OfficeType::BRANCH->value,
            'Mitra Agen' => OfficeType::AGENT_PARTNER->value,
            'Mitra Pemasaran' => OfficeType::MARKETING_PARTNER->value,
            default => OfficeType::HEADQUARTER->value,
        };

        return [
            'product_id' => $productSelected,
            'product_type_id' => $productTypeSelected,
            'job_group' => $jobGroupSelected,
            'office_type' => $officeType,
            'office_id' => $officeSelected,
        ];
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EmployeeLimit $employeeLimit)
    {
        // $requestValid = $request->validate(
        //   ['limit' => 'required'],
        //   ['limit.required' => 'Limit wajib diisi']
        // );

        try {

            DB::beginTransaction();

            // Selected Guarantor
            $guarantor = Guarantor::first();
            $guarantorId = $guarantor ? $guarantor->id : null;
            $jobType = JobType::UNCONDITIONAL->value;

            // filter for guarantor product type limit
            $productId = $request->get('product_id') ?? null;
            $productTypeId = $request->get('product_type_id') ?? null;
            $jobGroup = $request->get('job_group') ?? null;
            $profileId = $request->get('office_id') ?? null;
            $requestLimit = $request->get('limit') ?? null;
            $requestLimitInherit = $request->get('limit_inherit') ?? null;

            $guarantorProductType = GuarantorToProductType::query()
                ->with(['productType'])
                ->where('guarantor_id', $guarantorId)
                ->where('product_id', $productId)
                ->where('product_type_id', $productTypeId)
                ->where('job_group', $jobGroup)
                ->where('job_type', $jobType)
                ->first();

            $guarantorProductTypeId = $guarantorProductType?->id;

            $profileLimit = ProfileLimit::query()
                ->where('guarantor_id', $guarantorId)
                ->where('guarantor_to_product_type_id', $guarantorProductTypeId)
                ->where('profile_id', $profileId)
                ->first();

            $limit = (int) str_replace('.', '', $requestLimit);
            $limit_inherit = (int) str_replace('.', '', $requestLimitInherit);

            if ($limit > $profileLimit->getAttribute('limit') || $limit_inherit > $profileLimit->getAttribute('limit_inherit')) {
                throw new Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            $updated = $employeeLimit->update(
                [
                    'limit' => $limit,
                    'limit_inherit' => $limit_inherit,
                ]
            );
            if (! $updated) {
                throw new Exception('Gagal mengubah limit pengguna');
            }

            activity()
                ->useLog('employee-limit')
                ->performedOn(new EmployeeLimit)
                ->causedBy(auth()->user())
                ->log('Mengubah limit pengguna');
            DB::commit();

            flashMessage('success', 'Limit pengguna berhasil diubah');

            $params = $this->setParams(
                $productId,
                $productTypeId,
                $jobGroup,
                $profileId
            );

            return redirect()->route('employee-limit.index', $params);
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error update profile limit', $error);
            flashMessage('Gagal', $error['message']);

            return redirect()->back()->withErrors($error);
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
                throw new Exception('Gagal menghapus limit pengguna');
            }

            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error delete profile limit', $error);
        }
    }
}
