<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\Rate\StoreRequest;
use App\Http\Resources\Guarantor\GuarantorToProductTypeResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
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
        $guarantors = Guarantor::with(['head', 'product', 'productType'])->whereNull('headquarter_id')->get();
        $guarantor = $guarantors->find($request->get('guarantor_id')) ?? $guarantors->first();

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
                    });
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
    public function create(Request $request, GuarantorToProductType $guarantorToProductType): \Inertia\Response
    {
        $component = str_replace('/'.$guarantorToProductType->getAttribute('id'), '', $request->path()).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tarif Asuransi',
            ],
            'guarantorToProductType' => $guarantorToProductType,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRequest $request, GuarantorToProductType $guarantorToProductType)
    {
        $requestValid = $request->validated();

        try {
            DB::beginTransaction();
            $data = [
                ...$requestValid,
                'minimum_bill' => $this->currencyConvert($requestValid['minimum_bill']),
                'minimum_payment' => $this->currencyConvert($requestValid['minimum_payment']),
                'sales_administration' => $this->currencyConvert($requestValid['sales_administration']),
                'payment_administration' => $this->currencyConvert($requestValid['payment_administration']),
                'minimum_management_fee' => $this->currencyConvert($requestValid['minimum_management_fee']),
                'stamp_duty' => $this->currencyConvert($requestValid['stamp_duty']),
                'broken_rate' => $this->currencyConvert($requestValid['broken_rate']),
                'revised_rate' => $this->currencyConvert($requestValid['revised_rate']),
            ];

            $guarantorToProductType->update($data);
            activity()
                ->useLog('guarantor-rate')
                ->performedOn($guarantorToProductType)
                ->causedBy(auth()->user())
                ->log('Setting Limit Asuransi');
            flashMessage('Berhasil', 'Data berhasil disimpan');
            DB::commit();

            return redirect()->route('guarantor-rate.index', [
                'guarantor_id' => $guarantorToProductType->getAttribute('guarantor_id'),
                'product_id' => $guarantorToProductType->getAttribute('product_id'),
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
