<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Resources\Office\ProfileResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorProductTypeLimit;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Guarantor\ProfileLimit;
use App\Models\Profile;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ProfileLimitController extends Controller
{
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
            ->appends('query', null)
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
    public function store(Request $request): JsonResponse
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

            if ($limit > $guarantorProductLimit->getAttribute('limit') || $limitInherit > $guarantorProductLimit->getAttribute('limit')) {
                throw new \Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            ProfileLimit::query()->create(
                [
                    'guarantor_id' => $requestValid['guarantor_id'],
                    'guarantor_to_product_type_id' => $requestValid['guarantor_to_product_type_id'],
                    'profile_id' => $requestValid['profile_id'],
                    'limit' => $limit,
                    'limit_inherit' => $limitInherit,
                ]
            );
            activity()
                ->useLog('profile')
                ->performedOn(new ProfileLimit)
                ->causedBy($request->user())
                ->withProperties($requestValid)
                ->log('Menambahkan limit kantor');
            DB::commit();

            return $this->responseSuccess('Berhasil menambahkan limit kantor');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error store profile limit', ['error' => $e->getMessage()]);

            return $this->responseError('Gagal menambahkan limit kantor', ['message' => $e->getMessage()]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProfileLimit $profileLimit): JsonResponse
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
            ]);

        try {
            DB::beginTransaction();

            $guarantorProductLimit = GuarantorProductTypeLimit::query()
                ->where('guarantor_id', $requestValid['guarantor_id'])
                ->where('guarantor_to_product_type_id', $requestValid['guarantor_to_product_type_id'])
                ->first();

            $limit = (int) str_replace('.', '', $requestValid['limit']);
            $limitInherit = (int) str_replace('.', '', $requestValid['limit_inherit']);

            if ($limit > $guarantorProductLimit->getAttribute('limit') || $limitInherit > $guarantorProductLimit->getAttribute('limit')) {
                throw new \Exception('Limit yang diberikan melebihi limit yang tersedia');
            }

            $updated = $profileLimit->update(
                [
                    'limit' => $limit,
                    'limit_inherit' => $limitInherit,
                ]
            );
            if (! $updated) {
                throw new \Exception('Gagal mengubah limit kantor');
            }
            activity()
                ->useLog('profile')
                ->performedOn($profileLimit)
                ->causedBy($request->user())
                ->withProperties($requestValid)
                ->log('Mengubah limit kantor');
            DB::commit();

            return $this->responseSuccess('Berhasil mengubah limit kantor');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error update profile limit', ['error' => $e->getMessage()]);

            return $this->responseError('Gagal mengubah limit kantor', ['message' => $e->getMessage()]);
        }
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
                throw new \Exception('Gagal menghapus limit kantor');
            }
            activity()
                ->useLog('profile')
                ->performedOn($profileLimit)
                ->causedBy(auth()->user())
                ->log('Menghapus limit kantor');
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error delete profile limit', ['error' => $e->getMessage()]);
        }
    }
}
