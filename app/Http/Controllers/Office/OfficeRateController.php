<?php

namespace App\Http\Controllers\Office;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Enums\OfficeType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Office\Rate\StoreRequest;
use App\Http\Resources\Guarantor\GuarantorToProductTypeResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Profile\Profile;
use App\Models\Profile\ProfileRate;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class OfficeRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $officeTypes = OfficeType::getName();
        $officeTypeSelected = $request->get('office_type', $officeTypes[0]);
        $officeType = OfficeType::getValueOfName()[$officeTypeSelected];
        $offices = Profile::query()->where('office_type', $officeType)->get();
        $officeSelected = (int) ($request->get('profile_id') ?? $offices->first()?->getAttribute('id'));
        $guarantors = Guarantor::with(['product', 'productType'])->whereNull('headquarter_id')->get();
        $guarantor = $guarantors->find($request->get('guarantor_id')) ?? $guarantors->first();
        $guarantorBranches = Guarantor::with(['product', 'productType'])->where('headquarter_id', $guarantor->getAttribute('id'))->get();
        $guarantorBranches->unshift((object) [
            'id' => 0,
            'name' => 'Kantor Pusat',
        ]);
        $guarantorBranchSelected = (int) $request->get('guarantor_branch_id') ?: null;
        $products = $guarantor->product?->unique()->values();
        $product = $products?->firstWhere('id', $request->get('product_id')) ?? $products?->first();

        $guarantorSelected = $guarantor->id ?? null;
        $productSelected = $product->id ?? null;
        $jobGroups = JobGroup::getValues();
        $jobGroupSelected = $request->get('job_group') ?? $jobGroups[0];
        $jobTypes = JobType::getValues();
        $jobTypeSelected = $request->get('job_type') ?? $jobTypes[1];

        $guarantorProductTypes = GuarantorToProductType::search($request->get('search'))
            ->query(function ($query) use ($guarantorSelected, $productSelected, $jobGroupSelected, $jobTypeSelected) {
                $query->where('guarantor_id', $guarantorSelected)
                    ->where('product_id', $productSelected)
                    ->when($jobGroupSelected, function ($query, $jobGroup) {
                        $query->where('job_group', $jobGroup);
                    })
                    ->when($jobTypeSelected, function ($query, $jobType) {
                        $query->where('job_type', $jobType);
                    })
                    ->with('guarantorRate');
            })
            ->orderBy('no')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());

        $resource = GuarantorToProductTypeResource::collection($guarantorProductTypes);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tarif Unit Bisnis',
            ],
            'offices' => $offices,
            'officeTypes' => $officeTypes,
            'officeSelected' => $officeSelected,
            'officeTypeSelected' => $officeTypeSelected,
            'guarantors' => $guarantors,
            'guarantorSelected' => $guarantorSelected,
            'guarantorBranches' => $guarantorBranches,
            'guarantorBranchSelected' => $guarantorBranchSelected,
            'products' => $products,
            'productSelected' => $productSelected,
            'jobGroups' => $jobGroups,
            'jobGroupSelected' => $jobGroupSelected,
            'jobTypes' => $jobTypes,
            'jobTypeSelected' => $jobTypeSelected,
            'guarantorProductTypes' => fn () => $resource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): Response
    {
        $request->validate([
            'profile_id' => 'required|exists:'.Profile::class.',id,deleted_at,NULL',
            'guarantor_id' => 'required|exists:'.Guarantor::class.',id,deleted_at,NULL',
            'guarantor_branch_id' => 'nullable|exists:'.Guarantor::class.',id,deleted_at,NULL',
            'guarantor_product_type_id' => 'required|exists:'.GuarantorToProductType::class.',id,deleted_at,NULL',
        ]);
        $profileId = $request->get('profile_id');
        $profile = Profile::query()->find($profileId);
        $guarantorId = $request->get('guarantor_id');
        $guarantor = Guarantor::query()->find($guarantorId);
        $guarantorBranchId = $request->get('guarantor_branch_id');
        $guarantorToProductTypeId = $request->get('guarantor_product_type_id');
        $guarantorRate = ProfileRate::query()
            ->where([
                'profile_id' => $profileId,
                'guarantor_id' => $guarantorId,
                'guarantor_branch_id' => $guarantorBranchId,
                'guarantor_to_product_type_id' => $guarantorToProductTypeId,
            ])->first();
        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tarif Unit Bisnis',
            ],
            'profileId' => $profileId,
            'profile' => $profile,
            'guarantorId' => $guarantorId,
            'guarantor' => $guarantor,
            'guarantorBranchId' => $guarantorBranchId,
            'guarantorToProductTypeId' => $guarantorToProductTypeId,
            'guarantorRate' => $guarantorRate,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        try {
            DB::beginTransaction();
            $requestValid = $request->validated();
            $data = [
                'minimum_bill' => $this->currencyConvert($requestValid['minimum_bill']),
                'selling_rate' => $requestValid['selling_rate'],
                'sales_administration' => $this->currencyConvert($requestValid['sales_administration']),
                'management_fee' => $requestValid['management_fee'],
                'minimum_management_fee' => $this->currencyConvert($requestValid['minimum_management_fee']),
                'broken_rate' => $this->currencyConvert($requestValid['broken_rate']),
                'revised_rate' => $this->currencyConvert($requestValid['revised_rate']),
            ];

            $guarantorRate = ProfileRate::query()
                ->updateOrCreate(
                    [
                        'profile_id' => $requestValid['profile_id'],
                        'guarantor_id' => $requestValid['guarantor_id'],
                        'guarantor_branch_id' => $requestValid['guarantor_branch_id'] ?? null,
                        'guarantor_to_product_type_id' => $requestValid['guarantor_to_product_type_id'],
                    ],
                    $data
                );
            $officeTypeSelected = $guarantorRate->load('profile')->getRelation('profile')?->office_type;
            $officeType = OfficeType::getNameOfValue()[$officeTypeSelected];
            activity()
                ->useLog('office-rate')
                ->performedOn($guarantorRate)
                ->causedBy(auth()->user())
                ->log('Setting Limit Unit Bisnis');
            flashMessage('Berhasil', 'Data berhasil disimpan');

            DB::commit();

            return redirect()->route('office-rate.index', [
                'office_type' => $officeType,
                'profile_id' => $guarantorRate->getAttribute('profile_id'),
                'guarantor_id' => $guarantorRate->getAttribute('guarantor_id'),
                'branch_guarantor_id' => $guarantorRate->getAttribute('branch_guarantor_id'),
                'product_id' => $guarantorRate->getAttribute('product_id'),
                'job_group' => $guarantorRate->getAttribute('job_group'),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Gagal menyimpan data', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Error store office rate', $error);

            return back()->with('error', 'Gagal menyimpan data');
        }
    }
}
