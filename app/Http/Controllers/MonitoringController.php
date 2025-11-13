<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Enums\SubmissionStatus;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Document\DocumentFormat;
use App\Models\Document\RequiredDoc;
use App\Models\Guarantor\Blank;
use App\Models\Submission\Submission;
use App\Traits\FilterOffice;
use App\Traits\ReplaceDocumentFormat;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;

class MonitoringController extends Controller
{
  use FilterOffice, ReplaceDocumentFormat;

  /**
   * Display the monitoring dashboard.
   */
  public function submission(Request $request): Response
  {
    $status = SubmissionStatus::getValues();
    $statusSelected = $request['status_selected'] ?? null;
    $isAdmin = $request->user()->hasRole(RoleEnum::Admin->value);
    $officeMonitorings = collect($request->user()->officeMonitorings);
    $officeIds = $officeMonitorings->pluck('id')->toArray();

    $officeFilter = $this->filterOffice($request, OfficeType::BRANCH, ! $isAdmin ? $officeIds : null);
    $officeTypes = $officeFilter->officeTypes;
    $offices = $officeFilter->offices;
    $officeTypeSelected = $officeFilter->officeTypeSelected;
    $officeSelected = $officeFilter->officeSelected;
    $search = $request->input('search');

    $submissions = Submission::query()
      ->when($search, function ($query, $search) {
        $query->where(function ($query) use ($search) {
          $query->whereLike('no_guarantee', "%$search%")
            ->orWhereHas('principal', function ($query) use ($search) {
              $query->whereLike('name', "%$search%");
            });
        });
      })
      ->where('guarantor_id', config('guarantor.id'))
      ->where('product_id', config('product.id'))
      ->when(! $isAdmin, fn($query) => $query->whereHas('staff', fn($query) => $query->whereIn('profile_id', $officeIds)))
      ->when($officeSelected, fn($query) => $query->whereHas('staff', fn($query) => $query->where('profile_id', $officeSelected)))
      ->when($statusSelected, fn($query) => $query->where('status', $statusSelected))
      ->with([
        'scores',
        'principal',
        'bank',
        'obligee',
        'employeeLimit',
        'sourceOfFund',
        'guarantor',
        'guarantorToProductType',
        'guarantorProductTypeLimit',
        'staff:id,name,profile_id',
        'staff.office:id,name',
      ])
      ->orderByDesc('created_at')
      ->paginate($request->get('per_page') ?? 10)
      ->withQueryString();
    $resource = SubmissionResource::collection($submissions);

    return inertia('monitoring/submission/index', [
      'page_settings' => fn() => [
        'title' => 'Pengajuan',
      ],
      'submissions' => fn() => $resource,
      'status' => $status,
      'statusSelected' => $statusSelected,
      'officeTypes' => $officeTypes,
      'offices' => $offices,
      'officeTypeSelected' => $officeTypeSelected,
      'officeSelected' => $officeSelected,
    ]);
  }

  public function submissionDetail(Submission $submission): Response
  {
    $submission->load([
      'principal' => function ($query) {
        $query->withTrashed();
      },
      'principal.documents' => function ($query) {
        $query->withTrashed();
      },
      'principal.principalRatios' => function ($query) {
        $query->withTrashed();
      },
      'guarantor' => function ($query) {
        $query->withTrashed();
      },
      'guarantor.documentFormats',
      'guarantorBranch' => function ($query) {
        $query->withTrashed();
      },
      'guarantorToProductType' => function ($query) {
        $query->withTrashed();
      },
      'obligee' => function ($query) {
        $query->withTrashed();
      },
      'blanks',
      'obligee.province',
      'obligee.regency',
      'obligee.district',
      'principal.province',
      'principal.regency',
      'principal.district',
      'guarantor.province',
      'guarantor.regency',
      'guarantor.district',

      'district',
      'province',
      'regency',
      'sourceOfFund' => function ($query) {
        $query->withTrashed();
      },
      'submissionDocs',
      'submissionDocs.documentFormat:id,no',
      'scores',
      'scores.scoring' => function ($query) {
        $query->withTrashed();
      },
      'scores.scoringQuestionCategory' => function ($query) {
        $query->withTrashed();
      },
      'scores.scoringQuestion' => function ($query) {
        $query->withTrashed();
      },
      'scores.scoringOption' => function ($query) {
        $query->withTrashed();
      },
      'userChecked' => function ($query) {
        $query->withTrashed();
      },
      'userApproved' => function ($query) {
        $query->withTrashed();
      },
      'userRejected' => function ($query) {
        $query->withTrashed();
      },
      'staff' => function ($query) {
        $query->withTrashed();
      },
      'employeeLimit',
      'guarantorProductTypeLimit',
      'callback',
      'supportDocs',
    ]);
    $principal = $submission->getRelation('principal');
    $principalDocs = $principal->getRelation('documents');
    $blank = $submission->getRelation('blanks')->first();

    if ($submission->getAttribute('status') === SubmissionStatus::PROCESS->value && $blank) {
      $blank->number = str_pad('X', 16, 'X');
    }
    $submission->setAttribute('blank', $blank);

    $requiredDocs = RequiredDoc::query()->get(['id', 'product_type_id', 'name', 'description', 'created_at'])
      ->map(function ($doc) use ($principalDocs) {
        $principalDoc = $principalDocs->firstWhere('required_doc_id', $doc->id);
        $doc->setAttribute('name', $principalDoc?->getAttribute('name') ?? $doc->name);
        $doc->setAttribute('url', $principalDoc?->getAttribute('url') ? Storage::url($principalDoc->url) : null);

        return $doc->only(['id', 'name', 'description', 'url']);
      });

    $firstYearRatio = $submission->getAttribute('first_year_ratio');
    $lastYearRatio = $submission->getAttribute('last_year_ratio');
    $ratios = $principal->getRelation('principalRatios');
    if ($firstYearRatio && $lastYearRatio) {
      $ratios = $ratios->whereIn('year', [
        $firstYearRatio,
        $lastYearRatio,
      ]);
    }
    $principal->setAttribute('ratios', $ratios->values()->toArray());

    $submission->getRelation('scores')->map(function ($score) {
      $score->setAttribute('category_name', $score->scoringQuestionCategory->name ?? '-');
      $score->setAttribute('question_name', $score->scoringQuestion->name ?? '-');
      $score->setAttribute('option_name', $score->scoringOption->name ?? '-');

      return $score;
    });

    $principal->setAttribute('approved_submissions', $principal->approvedSubmissions()
      ->select(['id', 'contract_doc_name', 'contract_doc_number', 'contract_value', 'status', 'created_at'])
      ->with('obligee')
      ->get());

    // tanggal pengajuan
    $startDate = Carbon::parse($submission->getAttribute('start_date'))->translatedFormat('d F Y');
    $endDate = Carbon::parse($submission->getAttribute('end_date'))->translatedFormat('d F Y');

    $contractValueFormatted = $this->formatCurrency($submission->getAttribute('contract_value'));
    $guaranteeValueFormatted = $this->formatCurrency($submission->getAttribute('guarantee_value'));

    $documentFormats = DocumentFormat::query()
      ->whereNull(['guarantor_id', 'product_id', 'guarantor_to_product_type_id'])
      ->orWhere(function ($query) use ($submission) {
        $query->where('guarantor_id', $submission->getAttribute('guarantor_id'))
          ->where('product_id', $submission->getAttribute('product_id'))
          ->where(function ($query) use ($submission) {
            $query->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
              ->orWhereNull('guarantor_to_product_type_id');
          });
      })
      ->orderBy('no')
      ->get();

    $submissionDocsFile = $submission->getRelation('submissionDocs')->whereNotNull('url')->values();
    $submissionDocs = $submission->getAttribute('has_send_to_guarantor')
      ? $submission->getRelation('submissionDocs')->whereNotNull('document_format_id')->values() : collect();
    // sort by no
    $submissionDocs = $submissionDocs->sortBy(function ($doc) {
      return $doc->getRelation('documentFormat')->getAttribute('no');
    })->values();
    $finalOutputFile = $submissionDocsFile->map(function ($doc) {
      $document = $doc->only('name', 'url');
      $document['name'] = $doc->getAttribute('name') ?? '-';
      $document['url'] = Storage::url($doc->getAttribute('url'));

      return $document;
    });

    $callback = $submission->getRelation('callback');
    if ($callback) {
      $callback->setAttribute('url', $callback->getAttribute('url')
        ? Storage::url($callback->getAttribute('url'))
        : null);
    }

    $submissionInheritId = $submission->getAttribute('submission_inherit_id');
    $employeeLimit = $submission->getRelation('employeeLimit')
      ?->firstWhere('employee_id', auth()->id())
      ?->getAttribute($submissionInheritId ? 'limit_inherit' : 'limit', 0);
    $beyondTheLimit = $employeeLimit < $submission->getAttribute('guarantee_value');

    // get submission support docs
    $supportDocs = $submission->getRelation('supportDocs');

    $supportDocs = $supportDocs->map(function ($doc) {
      $date = $doc->getAttribute('date');
      $url = $doc->getAttribute('url');
      $doc->setAttribute('name', $doc->getAttribute('name') ?? '-');
      $doc->setAttribute('number', $doc->getAttribute('number') ?? '-');
      $doc->setAttribute('date', $date ? Carbon::parse($date)->translatedFormat('d F Y') : null);
      if ($url) {
        $doc->setAttribute('url', Storage::url($url));
      }

      return $doc;
    });

    $submissionConverted = $this->convertSubmission((clone $submission));
    foreach ($documentFormats as $documentFormat) {
      $documentFormat->setAttribute('format_document', $this->replaceDocumentFormat($documentFormat, $submissionConverted));
    }
    $totalScore = $submission->getRelation('scores')->sum('point');

    $submission->setAttribute('contract_value_formatted', $contractValueFormatted);
    $submission->setAttribute('guarantee_value_formatted', $guaranteeValueFormatted);
    $submission->unsetRelation('submissionDocs');
    $submission->setAttribute('submission_docs', $submissionDocs);
    $submission->setAttribute('required_docs', $requiredDocs);
    $submission->setAttribute('start_date', $startDate);
    $submission->setAttribute('end_date', $endDate);
    $submission->setAttribute('document_formats', $documentFormats);
    $submission->setAttribute('beyond_the_limit', $beyondTheLimit);
    $submission->setAttribute('support_docs', $supportDocs);
    $submission->setAttribute('final_output_file', $finalOutputFile);
    $submission->setAttribute('callback', $callback);
    $submission->setAttribute('employee_limit', $employeeLimit);
    $submission->setAttribute('total_score', $totalScore);

    return inertia('monitoring/submission/detail/index', [
      'submission' => fn() => $submission,
    ]);
  }
}
