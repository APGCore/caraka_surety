<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\JobType;
use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Resources\Office\ProfileResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorProductTypeLimit;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Profile\Profile;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProfileLimitController extends Controller
{
    public function apiSearch(Request $request)
    {

        // office types
        $officeTypes = ['Kantor Pusat', 'Kantor Cabang', 'Mitra Agen', 'Mitra Pemasaran'];

        // Selected Guarantor
        $guarantor = Guarantor::first();
        $guarantor_id = $guarantor ? $guarantor->id : null;

        // default job type Jastan to unconditional
        $job_type = JobType::UNCONDITIONAL->value;

        // request
        $search = $request->get('search') ?? '';
        $isPageAble = $request->get('is_page_able') ?? 'true';
        $perPage = $request->get('per_page') ?? 10;
        $page = $request->get('page') ?? 1;

        // filter for guarantor product type limit
        $product_id = $request->get('product_id') ?? null;
        $product_type_id = $request->get('product_type_id') ?? null;
        $office_type = $request->get('office_type') ?? $officeTypes[0];
        $job_group = $request->get('job_group') ?? null;

        // selected office type
        $selectedOfficeType = match ($office_type) {
            'Kantor Cabang' => OfficeType::BRANCH->value,
            'Mitra Agen' => OfficeType::AGENT_PARTNER->value,
            'Mitra Pemasaran' => OfficeType::MARKETING_PARTNER->value,
            default => OfficeType::HEADQUARTER->value,
        };

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

        // selected guarantor product type limit
        $guarantorProductTypeLimit = GuarantorProductTypeLimit::query()
            ->where('guarantor_id', $guarantor_id)
            ->where('guarantor_to_product_type_id', $guarantorProductTypeId)
            ->first();

        // profiles
        $profiles = Profile::search($search)
            ->query(function (Builder $query) use ($guarantor_id, $guarantorProductTypeId, $selectedOfficeType) {
                return $query->when($guarantor_id, function ($query) use ($guarantor_id, $guarantorProductTypeId, $selectedOfficeType) {
                    $query->with(['profileLimit' => function ($query) use ($guarantor_id, $guarantorProductTypeId) {
                        $query->where('guarantor_id', $guarantor_id)
                            ->where('guarantor_to_product_type_id', $guarantorProductTypeId)
                            ->with(['guarantorToProductType.productType']);
                    }])
                        ->when($selectedOfficeType, function ($query) use ($selectedOfficeType) {
                            $query->where('office_type', $selectedOfficeType);
                        });
                });
            })
            ->orderBy('created_at', 'desc');

        // if is page able is true, then paginate the data
        $profiles = $isPageAble !== 'false'
          ? $profiles->paginate(
              perPage: $perPage,
              page: $page
          )
          : $profiles->get();

        // if is page able is true, then return the resource, otherwise return the data
        $profileResource = ProfileResource::collection($profiles);

        $datas = [
            'profiles' => $profileResource,
            'guarantorProductTypeLimit' => [
                ...($guarantorProductTypeLimit?->toArray() ?? []),
                'product_type_name' => $productTypeName,
            ],
        ];

        // if is page able is true, then return the resource, otherwise return the data
        $response = $isPageAble !== 'false' ? [
            'data' => $datas,
            'meta' => [
                'current_page' => $profiles->currentPage(),
                'from' => $profiles->firstItem(),
                'to' => $profiles->lastItem(),
                'last_page' => $profiles->lastPage(),
                'per_page' => (int) $perPage,
                'total' => $profiles->total(),
            ],
        ] : $datas;

        return $this->responseSuccess('Berhasil mengambil data limit kantor', $response);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $guarantors = Guarantor::whereNull('headquarter_id')->get(['id', 'name']);
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

        // limit
        $limit = GuarantorProductTypeLimit::query()
            ->where('guarantor_id', $guarantorSelected)
            ->where('guarantor_to_product_type_id', $guarantorToProductTypeId)
            ->first();

        $profiles = Profile::search($request->get('search'))
            ->query(function (Builder $query) use ($guarantorSelected, $guarantorToProductTypeId, $officeType) {
                return $query->when($guarantorSelected, function ($query) use ($guarantorSelected, $guarantorToProductTypeId, $officeType) {
                    $query->with(['profileLimit' => function ($query) use ($guarantorSelected, $guarantorToProductTypeId) {
                        $query->where('guarantor_id', $guarantorSelected)->where('guarantor_to_product_type_id', $guarantorToProductTypeId);
                    }])->when($officeType, function ($query) use ($officeType) {
                        $query->where('office_type', $officeType);
                    });
                });
            })
            ->orderBy('id')
            ->paginate($request->get('per_page') ?? 10)
            ->withQueryString()
            ->appends($request->all());

        $profileResource = ProfileResource::collection($profiles);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Pembagian Limit per Kantor',
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
            'officeTypes' => $officeTypes,
            'officeTypeSelected' => $officeTypeSelected,
            'limit' => $limit,
            'profiles' => fn () => $profileResource,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $requestValid = $request->validate(
            [
                'guarantor_id' => 'required|exists:'.Guarantor::class.',id,deleted_at,NULL',
                'guarantor_to_product_type_id' => 'required|exists:'.GuarantorToProductType::class.',id,deleted_at,NULL',
                'profile_id' => 'required|exists:'.Profile::class.',id,deleted_at,NULL',
                'limit' => 'required',
                'limit_inherit' => 'required',
            ],
            [
                'guarantor_id.required' => 'Kantor belum dipilih',
                'guarantor_to_product_type_id.required' => 'Produk belum dipilih',
                'profile_id.required' => 'Profil belum dipilih',
                'limit.required' => 'Batas Kewenangan wajib diisi',
                'limit_inherit.required' => 'Batas Kewenangan Turunan wajib diisi',
            ]
        );

        try {
            DB::beginTransaction();

            $guarantorProductLimit = GuarantorProductTypeLimit::query()
                ->where('guarantor_id', $requestValid['guarantor_id'])
                ->where('guarantor_to_product_type_id', $requestValid['guarantor_to_product_type_id'])
                ->first();

            $limit = (int) str_replace('.', '', $requestValid['limit']);
            $limitInherit = (int) str_replace('.', '', $requestValid['limit_inherit']);

            if ($limit > $guarantorProductLimit->getAttribute('limit') || $limitInherit > $guarantorProductLimit->getAttribute('limit_inherit')) {
                throw new Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            $profileLimit = ProfileLimit::query()->create([
                'guarantor_id' => $requestValid['guarantor_id'],
                'guarantor_to_product_type_id' => $requestValid['guarantor_to_product_type_id'],
                'profile_id' => $requestValid['profile_id'],
                'limit' => $limit,
                'limit_inherit' => $limitInherit,
            ]);
            $profileLimit->load('guarantorToProductType');
            activity()
                ->useLog('profile')
                ->performedOn(new ProfileLimit)
                ->causedBy($request->user())
                ->withProperties($requestValid)
                ->log('Menambahkan limit kantor');
            DB::commit();

            flashMessage('success', 'Limit Kantor berhasil ditambahkan');

            $guarantorToProductType = $profileLimit->getRelation('guarantorToProductType');
            $params = $this->setParams(
                $guarantorToProductType->getAttribute('product_id'),
                $guarantorToProductType->getAttribute('product_type_id'),
                $guarantorToProductType->getAttribute('job_group'),
                $profileLimit->getAttribute('profile_id'),
            );
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error store profile limit', $error);
        }

        return redirect()->route('profile-limit.index', $params ?? []);
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
    public function update(Request $request, ProfileLimit $profileLimit)
    {
        $requestValid = $request->validate(
            [
                'guarantor_id' => 'required|exists:'.Guarantor::class.',id,deleted_at,NULL',
                'guarantor_to_product_type_id' => 'required|exists:'.GuarantorToProductType::class.',id,deleted_at,NULL',
                'limit' => 'required',
                'limit_inherit' => 'required',
            ],
            [
                'guarantor_id.required' => 'Kantor belum dipilih',
                'guarantor_to_product_type_id.required' => 'Produk belum dipilih',
                'limit.required' => 'Batas Kewenangan wajib diisi',
                'limit_inherit.required' => 'Batas Kewenangan Turunan wajib diisi',
            ]
        );

        try {
            DB::beginTransaction();

            $guarantorProductLimit = GuarantorProductTypeLimit::query()
                ->where('guarantor_id', $requestValid['guarantor_id'])
                ->where('guarantor_to_product_type_id', $requestValid['guarantor_to_product_type_id'])
                ->first();

            $limit = (int) str_replace('.', '', $requestValid['limit']);
            $limitInherit = (int) str_replace('.', '', $requestValid['limit_inherit']);

            if ($limit > $guarantorProductLimit->getAttribute('limit') || $limitInherit > $guarantorProductLimit->getAttribute('limit_inherit')) {
                throw new Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            $updated = $profileLimit->update(
                [
                    'limit' => $limit,
                    'limit_inherit' => $limitInherit,
                ]
            );
            if (! $updated) {
                throw new Exception('Gagal mengubah limit kantor');
            }
            activity()
                ->useLog('profile')
                ->performedOn($profileLimit)
                ->causedBy($request->user())
                ->withProperties($requestValid)
                ->log('Mengubah limit kantor');
            DB::commit();

            flashMessage('success', 'Limit Kantor berhasil diubah');

        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error update profile limit', $error);
        }

        $profileLimit->load('guarantorToProductType');
        $guarantorToProductType = $profileLimit->getRelation('guarantorToProductType');
        $params = $this->setParams(
            $guarantorToProductType->getAttribute('product_id'),
            $guarantorToProductType->getAttribute('product_type_id'),
            $guarantorToProductType->getAttribute('job_group'),
            $profileLimit->getAttribute('profile_id'),
        );

        return redirect()->route('profile-limit.index', $params);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProfileLimit $profileLimit)
    {
        try {
            DB::beginTransaction();

            $deleted = $profileLimit->delete();
            if (! $deleted) {
                throw new Exception('Gagal menghapus limit kantor');
            }
            activity()
                ->useLog('profile')
                ->performedOn($profileLimit)
                ->causedBy(auth()->user())
                ->log('Menghapus limit kantor');

            DB::commit();

            flashMessage('success', 'Limit Kantor berhasil dihapus');
        } catch (Exception $e) {
            DB::rollBack();
            $error = $this->handleErrorMessage($e);
            Log::error('Error delete profile limit', $error);

        }

        return redirect()->route('profile-limit.index');
    }
}
