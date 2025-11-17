<?php

namespace App\Http\Controllers\Guarantor;

use App\Enums\JobGroup;
use App\Enums\JobType;
use App\Http\Controllers\Controller;
use App\Http\Requests\Guarantor\Rate\CreateRequest;
use App\Http\Requests\Guarantor\Rate\ListRequest;
use App\Http\Requests\Guarantor\Rate\StoreRequest;
use App\Http\Resources\Guarantor\GuarantorRateResource;
use App\Http\Resources\Guarantor\GuarantorToProductTypeResource;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorRate;
use App\Models\Guarantor\GuarantorToProductType;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Response;

class GuarantorRateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
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
            ->appends('query')
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

    public function list(ListRequest $request)
    {
        $validated = $request->validated();
        $guarantorSelected = $validated['guarantor_id'];
        $guarantorBranchSelected = $validated['guarantor_branch_id'] ?? null;
        $guarantorToProductTypeSelected = $validated['guarantor_to_product_type_id'];
        $guarantorToProductType = GuarantorToProductType::query()->find($guarantorToProductTypeSelected, ['id', 'name', 'full_name']);
        $guarantorRates = GuarantorRate::search($request->get('search'))
            ->query(function ($query) use ($guarantorSelected, $guarantorBranchSelected, $guarantorToProductTypeSelected) {
                $query->where('guarantor_id', $guarantorSelected)
                    ->when($guarantorBranchSelected, function ($query, $guarantorBranchSelected) {
                        $query->where('guarantor_branch_id', $guarantorBranchSelected);
                    })
                    ->where('guarantor_to_product_type_id', $guarantorToProductTypeSelected);
            })
            ->orderByDesc('id')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query')
            ->appends($request->all());

        $resource = GuarantorRateResource::collection($guarantorRates);

        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Daftar Tarif Asuransi '.($guarantorToProductType ? $guarantorToProductType->full_name : ''),
            ],
            'guarantorSelected' => $guarantorSelected,
            'guarantorBranchSelected' => $guarantorBranchSelected,
            'guarantorToProductTypeSelected' => $guarantorToProductTypeSelected,
            'guarantorRates' => fn () => $resource,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(CreateRequest $request): Response
    {
        $guarantorId = $request->get('guarantor_id');
        $guarantor = Guarantor::query()->find($guarantorId);
        $guarantorBranchId = $request->get('guarantor_branch_id');
        $guarantorToProductTypeId = $request->get('guarantor_product_type_id');
        $guarantorToProductType = GuarantorToProductType::query()->with('product:id,name')->find($guarantorToProductTypeId);
        $guarantorRate = GuarantorRate::query()
            ->where([
                'guarantor_id' => $guarantorId,
                'guarantor_branch_id' => $guarantorBranchId,
                'guarantor_to_product_type_id' => $guarantorToProductTypeId,
            ])->first();
        $component = $request->path().'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Tarif Asuransi',
            ],
            'guarantorId' => $guarantorId,
            'guarantor' => $guarantor,
            'guarantorBranchId' => $guarantorBranchId,
            'guarantorToProductTypeId' => $guarantorToProductTypeId,
            'guarantorToProductType' => $guarantorToProductType,
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
                'guarantor_id' => $requestValid['guarantor_id'],
                'guarantor_branch_id' => $requestValid['guarantor_branch_id'] ?? null,
                'guarantor_to_product_type_id' => $requestValid['guarantor_to_product_type_id'],
                'minimum_payment' => $this->currencyConvert($requestValid['minimum_payment']),
                'pay_rate' => $requestValid['pay_rate'],
                'payment_administration' => $this->currencyConvert($requestValid['payment_administration']),
                'stamp_duty' => $this->currencyConvert($requestValid['stamp_duty']),
                'broken_rate' => $this->currencyConvert($requestValid['broken_rate']),
                'revised_rate' => $this->currencyConvert($requestValid['revised_rate']),
                'commission' => $requestValid['commission'],
                'pph' => $requestValid['pph'],
                'effective_at' => $requestValid['effective_at'],
            ];

            $guarantorRate = GuarantorRate::query()
                ->create($data);

            activity()
                ->useLog('guarantor-rate')
                ->performedOn($guarantorRate)
                ->causedBy(auth()->user())
                ->log('Setting Limit Asuransi');
            flashMessage('Berhasil', 'Data berhasil disimpan');
            DB::commit();

            return redirect()->route('guarantor-rate.list', [
                'guarantor_id' => $guarantorRate->getAttribute('guarantor_id'),
                'guarantor_branch_id' => $guarantorRate->getAttribute('guarantor_branch_id'),
                'guarantor_to_product_type_id' => $guarantorRate->getAttribute('guarantor_to_product_type_id'),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Gagal menyimpan data', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Error store guarantor rate', $error);

            return back()->with('error', 'Gagal menyimpan data');
        }
    }

    public function edit(GuarantorRate $guarantorRate)
    {
        $guarantorRate->load(['guarantorToProductType']);
        $component = str_replace('/'.$guarantorRate->getAttribute('id'), '', request()->path()).'/index';

        return inertia($component, [
            'page_settings' => [
                'title' => 'Edit Tarif Asuransi',
            ],
            'guarantorRate' => $guarantorRate,
        ]);
    }

    public function update(StoreRequest $request, GuarantorRate $guarantorRate)
    {
        try {
            DB::beginTransaction();
            $requestValid = $request->validated();
            $data = [
                'guarantor_id' => $requestValid['guarantor_id'],
                'guarantor_branch_id' => $requestValid['guarantor_branch_id'] ?? null,
                'guarantor_to_product_type_id' => $requestValid['guarantor_to_product_type_id'],
                'minimum_payment' => $this->currencyConvert($requestValid['minimum_payment']),
                'pay_rate' => $requestValid['pay_rate'],
                'payment_administration' => $this->currencyConvert($requestValid['payment_administration']),
                'stamp_duty' => $this->currencyConvert($requestValid['stamp_duty']),
                'broken_rate' => $this->currencyConvert($requestValid['broken_rate']),
                'revised_rate' => $this->currencyConvert($requestValid['revised_rate']),
                'commission' => $requestValid['commission'],
                'pph' => $requestValid['pph'],
                'effective_at' => $requestValid['effective_at'],
            ];

            $updated = $guarantorRate->update($data);
            if (! $updated) {
                throw new Exception('Gagal memperbarui data tarif asuransi');
            }

            activity()
                ->useLog('guarantor-rate')
                ->performedOn($guarantorRate)
                ->causedBy(auth()->user())
                ->log('Setting Limit Asuransi');
            flashMessage('Berhasil', 'Data berhasil diubah');
            DB::commit();

            return redirect()->route('guarantor-rate.list', [
                'guarantor_id' => $guarantorRate->getAttribute('guarantor_id'),
                'guarantor_branch_id' => $guarantorRate->getAttribute('guarantor_branch_id'),
                'guarantor_to_product_type_id' => $guarantorRate->getAttribute('guarantor_to_product_type_id'),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Gagal mengubah data', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Error update guarantor rate', $error);

            return back()->with('error', 'Gagal mengubah data');
        }
    }

    public function destroy(GuarantorRate $guarantorRate)
    {
        try {
            DB::beginTransaction();

            $deleted = $guarantorRate->delete();
            if (! $deleted) {
                throw new Exception('Gagal menghapus data tarif asuransi');
            }

            activity()
                ->useLog('guarantor-rate')
                ->performedOn($guarantorRate)
                ->causedBy(auth()->user())
                ->log('Hapus Tarif Asuransi');
            flashMessage('Berhasil', 'Data berhasil dihapus');
            DB::commit();

            return redirect()->route('guarantor-rate.list', [
                'guarantor_id' => $guarantorRate->getAttribute('guarantor_id'),
                'guarantor_branch_id' => $guarantorRate->getAttribute('guarantor_branch_id'),
                'guarantor_to_product_type_id' => $guarantorRate->getAttribute('guarantor_to_product_type_id'),
            ]);
        } catch (Exception $e) {
            DB::rollBack();
            flashMessage('Gagal', 'Gagal menghapus data', 'error');
            $error = $this->handleErrorMessage($e);
            Log::error('Error delete guarantor rate', $error);

            return back()->with('error', 'Gagal menghapus data');
        }
    }
}
