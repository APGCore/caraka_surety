<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Http\Resources\Report\BlankUsageResource;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Product\Product;
use App\Models\Submission\Submission;
use App\Traits\FilterOffice;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\ResponseFactory;

class ReportController extends Controller
{
    use FilterOffice;

    protected string $headComponent;

    public function __construct()
    {
        $this->headComponent = 'report';
    }

    public function productionReport(Request $request): Response|ResponseFactory
    {
        $date = collect($request->get('date') ?? [
            now()->subDays(7)->toDateString().' 00:00:00',
            now()->toDateString().' 23:59:59',
        ])->values();
        // if branch
        $user = $request->user();
        $user->load('office:id,office_type');
        if ($user->office?->office_type === OfficeType::BRANCH->value) {
            $officeFilter = $this->filterOffice($request, OfficeType::BRANCH, [$user->profile_id]);
        } else {
            $officeFilter = $this->filterOffice($request);
        }
        $officeTypes = $officeFilter->officeTypes;
        $offices = $officeFilter->offices;
        $officeTypeSelected = $officeFilter->officeTypeSelected;
        $officeSelected = $officeFilter->officeSelected;
        $guarantors = Guarantor::query()
            ->whereNull('headquarter_id')
            ->with('guarantorToProductTypes')
            ->get(['id', 'name']);
        $guarantorSelected = (int) $request->get('guarantor_id', config('guarantor.id'));
        $products = Product::query()
            ->with('productType')
            ->get(['id', 'name']);
        $productSelected = $request->get('product_id');
        $product = $products->firstWhere('id', $productSelected);
        $productTypes = $product ? $product->productType : [];
        $productTypeSelected = $request->get('product_type_id');
        $guarantorToProductType = $guarantors->firstWhere('id', $guarantorSelected)
            ?->guarantorToProductTypes->where('product_id', $productSelected)->where('product_type_id', $productTypeSelected)->first();
        $search = $request->get('search');

        $submissions = Submission::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->whereLike('no_guarantee', "%$search%")
                        ->orWhereHas('principal', function ($query) use ($search) {
                            $query->whereLike('name', "%$search%");
                        });
                });
            })
            ->where('has_send_to_guarantor', true)
            ->when($guarantorSelected, fn ($q) => $q->where('guarantor_id', $guarantorSelected))
            ->when($officeSelected, fn ($q) => $q->whereHas('staff', fn ($q) => $q->where('profile_id', $officeSelected)))
            ->when($productSelected, fn ($q) => $q->where('product_id', $productSelected))
            ->when($guarantorToProductType, fn ($q) => $q->where('guarantor_to_product_type_id', $guarantorToProductType->id))
            ->when($date->isNotEmpty(), fn ($q) => $q->whereBetween('approved_at', $date));

        $submissionIds = $submissions->pluck('id');

        $submissions = $submissions->with([
            'guarantor:id,name,code',
            'guarantorBranch:id,name,code',
            'guarantor.pattern:id,guarantor_id,prefix,content,suffix',
            'guarantor.guarantorRate',
            'product:id,name',
            'guarantorToProductType:id,code_product,code,name',
            'blank:id,number,is_broken,is_revised',
            'principal:id,name',
            'obligee:id,name',
            'staff:id,name,profile_id',
            'office:id,name,code,office_type',
            'office.profileRate',
            'submissionBefore:id,blank_id',
            'submissionBefore.blank',
        ])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->withQueryString();

        $resource = SubmissionResource::collection($submissions);
        $component = "$this->headComponent/production/index";

        return inertia($component, [
            'page_settings' => [
                'title' => 'Laporan Produksi',
            ],
            'submissions' => fn () => $resource,
            'submissionIds' => $submissionIds,
            'offices' => $offices,
            'officeTypes' => $officeTypes,
            'officeSelected' => (int) $officeSelected,
            'officeTypeSelected' => $officeTypeSelected,
            'guarantors' => $guarantors->map->only('id', 'name'),
            'guarantorSelected' => $guarantorSelected,
            'products' => $products,
            'productSelected' => (int) $productSelected,
            'productTypes' => $productTypes,
            'productTypeSelected' => (int) $productTypeSelected,
        ]);
    }

    public function blankUsage(Request $request)
    {
        $blanks = Blank::query()
            ->with([
                'guarantor:id,name',
                'profile:id,name',
                'fromProfile:id,name',
            ])
            ->when($request->get('search'), function ($query, $search) {
                $query->where('number', 'like', "%$search%");
            })
            ->orderBy('id')
            ->paginate($request->get('per_page') ?? 10)
            ->appends($request->all());

        $resource = BlankUsageResource::collection($blanks);

        return inertia("$this->headComponent./blanks-usage/index", [
            'page_settings' => [
                'title' => 'Laporan Penggunaan Blangko',
            ],
            'blankUsage' => fn () => $resource,
        ]);
    }
}
