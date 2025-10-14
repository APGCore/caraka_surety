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
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        //        $dateFrom = $request->input('date.from');
        //        $dateTo = $request->input('date.to');
        //        $date = ($dateFrom && $dateTo)
        //          ? [
        //              "$dateFrom 00:00:00",
        //              "$dateTo 23:59:59",
        //          ]
        //          : [
        //              now()->subDays(7)->toDateString().' 00:00:00',
        //              now()->toDateString().' 23:59:59',
        //          ];
        $year = (int) $request->input('date.year', now()->year);
        $month = (int) $request->input('date.month', now()->month);
        // period 1 is date 1 to 10
        // period 2 is date 11 to 20
        // period 3 is date 21 to end of month
        $nowPeriod = $this->getPeriod(now());
        $period = (int) $request->input('date.period', $nowPeriod);
        $date = [
            match ($period) {
                1 => "$year-$month-01 00:00:00",
                2 => "$year-$month-11 00:00:00",
                3 => "$year-$month-21 00:00:00",
            },
            match ($period) {
                1 => "$year-$month-10 23:59:59",
                2 => "$year-$month-20 23:59:59",
                3 => now()->endOfMonth()->toDateString().' 23:59:59',
            },
        ];
        // for filters
        // Get the created_at of the first submission in the collection
        $firstCreatedAt = Submission::query()->first()?->created_at;
        $firstYear = $firstCreatedAt ? $firstCreatedAt->year : now()->year;
        $years = collect(range($firstYear, now()->year))->map(fn($year) => [
          'id' => $year,
          'text' => $year,
          'value' => $year,
        ])->values()->all();
        $months = collect(range(1, 12))->map(fn($month) => [
          'id' => $month,
          'text' => Carbon::create()->month($month)->format('F'),
          'value' => $month,
        ])->values()->all();
        $periods = collect([
          ['id' => 1, 'text' => '1 (1 - 10)', 'value' => 1],
          ['id' => 2, 'text' => '2 (11 - 20)', 'value' => 2],
          ['id' => 3,'text' => '3 (21 - '.now()->endOfMonth()->day . ')', 'value' => 3],
        ]);

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
        Log::info('Date Filter Production', ['date' => $date, 'request' => $request->all()]);

        $submissionIds = Submission::query()
            ->when($search, function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->whereLike('no_guarantee', "%$search%")
                        ->orWhereHas('principal', function ($query) use ($search) {
                            $query->whereLike('name', "%$search%");
                        });
                });
            })
            ->when($guarantorSelected, fn ($q) => $q->where('guarantor_id', $guarantorSelected))
            ->when($officeSelected, fn ($q) => $q->where('office_id', $officeSelected))
            ->when($productSelected, fn ($q) => $q->where('product_id', $productSelected))
            ->when($guarantorToProductType, fn ($q) => $q->where('guarantor_to_product_type_id', $guarantorToProductType->id))
            ->where('has_send_to_guarantor', true)
            ->whereBetween('send_to_guarantor_at', $date)
            ->pluck('id');

        $submissions = Submission::query()
            ->whereIn('id', $submissionIds)
            ->with([
                'guarantor:id,name,code',
                'guarantorBranch:id,name,code',
                'guarantor.pattern:id,guarantor_id,prefix,content,suffix',
                'guarantor.guarantorRate',
                'product:id,name',
                'guarantorToProductType:id,code_product,code,name,full_name',
                'blank:id,number,is_broken,is_revised',
                'principal:id,name',
                'obligee:id,name',
                'staff:id,name,profile_id',
                'office:id,name,code,office_type',
                'office.profileRate',
                'submissionBefore:id,blank_id',
                'submissionBefore.blank',
            ])
            ->orderBy('no_guarantee')
            ->orderBy('approved_at', 'desc')
            ->paginate($request->get('per_page') ?? 10)
            ->withQueryString();


    // Patokan send_to_guarantor_at ke tanggap export
    $finalReports = collect();
    $revisionOnly = collect();

    foreach ($submissions as $submission) {
      // only take root submissions (no previous submission)
      if ($submission->submission_before_id === null) {
        $groups = collect();
        $groups->push($submission);

        // cari revisi yang berantai dari submission ini
        $currentId = $submission->id;

        foreach ($submissions as $next) {
          if ($next->submission_before_id === $currentId) {
            $groups->push($next);
            $currentId = $next->id;
          }
        }

        $finalReports->push([
          'submission_id' => $submission->id,
          'groups' => $groups->values(),
        ]);
      } else {
        $revisionOnly->push($submission);
      }
    }

    // ambil kepala (head) dari setiap revisi
    $submissionHeads = Submission::query()
      ->whereIn('id', $revisionOnly->pluck('submission_before_id'))
      ->get();

    // buat struktur yang sama seperti $finalReports untuk revisi
    $mergedReports = collect();

    foreach ($submissionHeads as $head) {
      $groups = collect();
      $groups->push($head);

      $currentId = $head->id;

      foreach ($revisionOnly as $revision) {
        if ($revision->submission_before_id === $currentId) {
          $groups->push($revision);
          $currentId = $revision->id;
        }
      }

      $mergedReports->push([
        'submission_id' => $head->id,
        'groups' => $groups->values(),
      ]);
    }

    // jika mau semua jadi satu (final + revision heads)
    $allReports = $finalReports->merge($mergedReports)->values();

    // Sort by the created_at of the first group (oldest first)
    $filteredReports = $allReports->sortBy(function ($report) {
      return $report['groups']->first()->created_at;
    })->values();



    $resource = SubmissionResource::collection($submissions);

    $component = "$this->headComponent/production/index";

    return inertia($component, [
      'page_settings' => [
        'title' => 'Laporan Produksi',
      ],
      'finalReports' => fn() => $finalReports,
      'allReports' => fn() => $filteredReports,
      'mergedReports' => fn() => $mergedReports,
      'submissions' => fn() => $resource,
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
      'filters' => array_merge(
        $request->only(['search', 'date']),
        compact('years', 'months', 'periods')
      ),
      'dates' => [
        'year' => (int) $year,
        'month' => (int) $month,
        'period' => (int) $period,
      ],
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

    return inertia("$this->headComponent/blanks-usage/index", [
      'page_settings' => [
        'title' => 'Laporan Penggunaan Blangko',
      ],
      'blankUsage' => fn() => $resource,
    ]);
  }

  private function getPeriod(Carbon $date): int
  {
    $day = $date->day;

    if ($day >= 1 && $day <= 10) {
      return 1;
    } elseif ($day >= 11 && $day <= 20) {
      return 2;
    }

    return 3;
  }
}
