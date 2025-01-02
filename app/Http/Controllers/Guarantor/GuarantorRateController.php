<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\Rate\StoreRequest;
use App\Http\Resources\Guarantor\GuarantorToProductTypeResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\GuarantorRate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class GuarantorRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): \Inertia\Response
    {
        $guarantors = Guarantor::with(['product', 'productType'])->whereNull('headquarter_id')->get();
        $guarantor = $guarantors->find($request->get('guarantor_id')) ?? $guarantors->first();
        $guarantorBranches = Guarantor::with(['product', 'productType'])->where('headquarter_id', $guarantor->getAttribute('id'))->get();
        $guarantorBranchSelected = $request->get('guarantor_branch_id');
        $products = $guarantor->product?->unique();
        $product = $products?->find($request->get('product_id')) ?? $products?->first();

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
                'title' => 'Tarif Asuransi',
            ],
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
    public function create(Request $request): \Inertia\Response
    {
        $request->validate([
            'guarantor_id' => 'required|exists:'.Guarantor::class.',id,deleted_at,NULL',
            'guarantor_product_type_id' => 'required|exists:'.GuarantorToProductType::class.',id,deleted_at,NULL',
        ]);
        $guarantorId = $request->get('guarantor_id');
        $guarantorProductTypeId = $request->get('guarantor_product_type_id');
        $guarantor = Guarantor::query()->find($guarantorId);
        $guarantorToProductType = GuarantorToProductType::query()->find($guarantorProductTypeId);
        $guarantorRate = GuarantorRate::query()
            ->where([
                'guarantor_id' => $guarantorId,
                'guarantor_to_product_type_id' => $guarantorProductTypeId,
            ])->first();
        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tarif Asuransi',
            ],
            'guarantor' => $guarantor,
            'guarantorToProductType' => $guarantorToProductType,
            'guarantorRate' => $guarantorRate,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request)
    {
        $requestValid = $request->validated();

        try {
            DB::beginTransaction();
            $data = [
                'minimum_bill' => $this->currencyConvert($requestValid['minimum_bill']),
                'minimum_payment' => $this->currencyConvert($requestValid['minimum_payment']),
                'sales_administration' => $this->currencyConvert($requestValid['sales_administration']),
                'payment_administration' => $this->currencyConvert($requestValid['payment_administration']),
                'minimum_management_fee' => $this->currencyConvert($requestValid['minimum_management_fee']),
                'stamp_duty' => $this->currencyConvert($requestValid['stamp_duty']),
                'broken_rate' => $this->currencyConvert($requestValid['broken_rate']),
                'revised_rate' => $this->currencyConvert($requestValid['revised_rate']),
            ];

            $guarantorRate = GuarantorRate::query()
                ->updateOrCreate(
                    [
                        'guarantor_id' => $requestValid['guarantor_id'],
                        'guarantor_to_product_type_id' => $requestValid['guarantor_to_product_type_id'],
                    ],
                    $data
                );
            activity()
                ->useLog('guarantor-rate')
                ->performedOn($guarantorRate)
                ->causedBy(auth()->user())
                ->log('Setting Limit Asuransi');
            flashMessage('Berhasil', 'Data berhasil disimpan');
            DB::commit();

            return redirect()->route('guarantor-rate.index', [
                'guarantor_id' => $guarantorRate->getAttribute('guarantor_id'),
                'branch_guarantor_id' => $guarantorRate->getAttribute('branch_guarantor_id'),
                'product_id' => $guarantorRate->getAttribute('product_id'),
                'job_group' => $guarantorRate->getAttribute('job_group'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Gagal menyimpan data', 'error');
            Log::error('Error store guarantor rate', ['error' => $e->getMessage()]);

            return back()->with('error', 'Gagal menyimpan data');
        }
    }
    //
}
