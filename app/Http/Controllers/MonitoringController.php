<?php

namespace App\Http\Controllers;

use App\Enums\OfficeType;
use App\Enums\RoleEnum;
use App\Enums\SubmissionStatus;
use App\Http\Resources\Submission\SubmissionResource;
use App\Models\Document\DocumentFormat;
use App\Models\Document\RequiredDoc;
use App\Models\Submission\Submission;
use App\Traits\FilterOffice;
use App\Traits\Numbering;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Response;
use Riskihajar\Terbilang\Facades\Terbilang;

class MonitoringController extends Controller
{
    use FilterOffice, Numbering;

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

        $submissions = Submission::search($request->get('search'))
            ->query(
                function ($query) use ($officeIds, $isAdmin, $statusSelected) {
                    $query->where('guarantor_id', config('guarantor.id'))
                        ->where('product_id', config('product.id'))
                        ->when(! $isAdmin, fn ($query) => $query->whereHas('staff', fn ($query) => $query->whereIn('profile_id', $officeIds)))
                        ->when($statusSelected, fn ($query) => $query->where('status', $statusSelected))
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
                        ]);
                }
            )
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page') ?? 10)
            ->appends('query', null)
            ->appends($request->all());
        $resource = SubmissionResource::collection($submissions);

        return inertia('monitoring/submission/index', [
            'page_settings' => fn () => [
                'title' => 'Pengajuan',
            ],
            'submissions' => fn () => $resource,
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
        $mailNumber = $this->generateNomorSurat($submission);
        $principal = $submission->getRelation('principal');
        $principalDocs = $principal->getRelation('documents');
        $blank = $submission->getRelation('blanks')->first();

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

        $contractValueFormatted = $this->formatCurrency($submission->getAttribute('contract_value'));
        $guaranteeValueFormatted = $this->formatCurrency($submission->getAttribute('guarantee_value'));
        $analystName = $submission->getRelation('staff')->getAttribute('name');

        $submission->getRelation('scores')->map(function ($score) {
            $score->setAttribute('category_name', $score->scoringQuestionCategory->name ?? '-');
            $score->setAttribute('question_name', $score->scoringQuestion->name ?? '-');
            $score->setAttribute('option_name', $score->scoringOption->name ?? '-');

            return $score;
        });

        // SCORING RESULT
        $analysis = ['character' => 0, 'capacity' => 0, 'capital' => 0, 'condition' => 0, 'collateral' => 0];

        $scoringResult = $submission->getRelation('scores')
            ->reduce(function ($grouped, $score) use (&$analysis) {
                $categoryId = $score->getAttribute('scoring_question_category_id');
                $category = $score->getRelation('scoringQuestionCategory');
                $categoryName = $category->getAttribute('name');

                if (! isset($grouped[$categoryId])) {
                    $grouped[$categoryId] = [
                        'id' => $categoryId,
                        'name' => $categoryName,
                        'items' => [],
                    ];
                }

                $grouped[$categoryId]['items'][] = $score;
                $point = $score->getAttribute('point') ?? 0;

                switch ($categoryName) {
                    case 'Character':
                        $analysis['character'] += $point;
                        break;
                    case 'Capacity':
                        $analysis['capacity'] += $point;
                        break;
                    case 'Capital':
                        $analysis['capital'] += $point;
                        break;
                    case 'Condition':
                        $analysis['condition'] += $point;
                        break;
                    case 'Collateral':
                        $analysis['collateral'] += $point;
                        break;
                }

                return $grouped;
            }, []);

        $guaranteeValue = $submission->getAttribute('guarantee_value');
        $terbilang = $guaranteeValue ? ucwords(Terbilang::make($guaranteeValue, ' Rupiah')) : '';

        // Hitung total skoring
        $totalScore = array_sum($analysis);

        // Tentukan notes dan recommendation
        if ($totalScore > 60 && $totalScore < 100) {
            $notes = 'Dipertimbangkan untuk disetujui';
            $recommendation = 'disetujui';
        } elseif ($totalScore <= 60) {
            $notes = 'Dipertimbangkan untuk ditambahkan mitigasi risiko';
            $recommendation = 'ditolak';
        } else {
            $notes = 'Skoring tidak valid';
            $recommendation = 'ditolak';
        }

        // GET EXPERIENCE
        $approvedSubmissionsExp = Submission::query()
            ->where('status', 'approved')
            ->where(function ($query) use ($submission) {
                $query->where('principal_id', $submission->getAttribute('principal_id'))
                    ->orWhere('obligee_id', $submission->getAttribute('obligee_id'));
            })
            ->with(['obligee'])
            ->get()
            ->map(function ($submission) use (&$index) {
                $index++;

                return "<tr style='text-align: left;'>
                    <td style='text-align: center;'>{$index}</td>
                    <td>{$submission->getRelation('obligee')->getAttribute('name')}</td>
                    <td>{$submission->getAttribute('job_name')}</td>
                    <td>Rp. ".number_format($submission->getAttribute('contract_value'), 0, ',', '.').'</td>
                    <td>'.date('Y', strtotime($submission->getAttribute('approved_at'))).'</td>
                </tr>';
            })->implode('');

        $getExp = "<table style='width: 100%; border-collapse: collapse; text-align: center;' border='1'>
                      <tr>
                          <td colspan='5' style='border-left: 1px solid black; border-right: 1px solid black; text-align: center;'>
                              <strong>PENGALAMAN KERJA</strong>
                          </td>
                      </tr>
                      <tr>
                          <td colspan='5' style='text-align:left'>
                              <strong>Berikut Pengalaman Kerja PT {$principal->getAttribute('name')}</strong>
                          </td>
                      </tr>
                      <tr>
                          <th>No</th>
                          <th>Obligee</th>
                          <th>Nama Proyek</th>
                          <th>Nilai Proyek</th>
                          <th>Tahun</th>
                      </tr>
                      {$approvedSubmissionsExp}
                  </table>";

        // GET SUSUNAN PENGURUS

        $pengurus = collect();

        if (! empty($principal->getAttribute('director_name'))) {
            $pengurus->push(['nama' => $principal->getAttribute('director_name'), 'jabatan' => 'Direktur']);
        }
        if (! empty($principal->commissioner)) {
            $pengurus->push(['nama' => $principal->getAttribute('commissioner'), 'jabatan' => 'Komisaris']);
        }

        if (! empty($principal->head_name)) {
            $pengurus->push(['nama' => $principal->getAttribute('head_name'), 'jabatan' => 'Kepala Cabang']);
        }

        $susunanPengurus = $pengurus->map(function ($pengurus, $index) {
            return "<tr>
                        <td style='text-align: center; vertical-align: middle;'>".($index + 1)."</td>
                        <td>{$pengurus['nama']}</td>
                        <td>{$pengurus['jabatan']}</td>
                    </tr>";
        })->implode('');

        $getAdministatorsPrincipal =
          "<table style='width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px;' border='1'>
              <tr>
                  <td colspan='3' style='text-align: center'><strong>SUSUNAN PENGURUS</strong></td>
              </tr>
              <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Jabatan</th>
              </tr>
              {$susunanPengurus}
          </table>";

        $principal->setAttribute('approved_submissions', $principal->approvedSubmissions()
            ->select(['id', 'contract_doc_name', 'contract_doc_number', 'contract_value', 'status', 'created_at'])
            ->with('obligee')
            ->get());

        // number surat
        $mailNumberResume = $this->generateNomorSuratResume($submission->getAttribute('id'), $submission->getAttribute('created_at'));
        // tanggal pengajuan
        $submissionDate = Carbon::parse($submission->getAttribute('created_at'))->translatedFormat('d F Y');
        $startDate = Carbon::parse($submission->getAttribute('start_date'))->translatedFormat('d F Y');
        $endDate = Carbon::parse($submission->getAttribute('end_date'))->translatedFormat('d F Y');
        $guaranteeIssueDate = Carbon::parse($submission->getAttribute('approved_at'))->translatedFormat('d F Y');
        $contractDocDate = Carbon::parse($submission->getAttribute('contract_doc_date'))->translatedFormat('d F Y');
        $dayName = Carbon::parse($submission->getAttribute('approved_at'))->translatedFormat('l');

        $documentFormatAnalysis = DocumentFormat::query()
            ->whereNull('guarantor_id')
            ->whereNull('product_id')
            ->whereNull('guarantor_to_product_type_id')
            ->first();
        $guarantor = $submission->getRelation('guarantor');
        $guarantorBranch = $submission->getRelation('guarantorBranch');
        $documentFormats = $guarantor->getRelation('documentFormats');
        $documentFormatGuarantor = $documentFormats->whereNull('product_id')->whereNull('guarantor_to_product_type_id')->values();
        $documentFormatProduct = $documentFormats->where('product_id', $submission->getAttribute('product_id'))->whereNull('guarantor_to_product_type_id')->values();
        $documentFormatTypeGuarantor = $documentFormats->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))->values();
        $guarantorAddress = $guarantorBranch->getAttribute('address') ?? $guarantor->getAttribute('address') ?? '';

        $submissionDocsFile = $submission->getRelation('submissionDocs')->whereNotNull('url')->values();
        $submissionDocs = $submission->getAttribute('has_send_to_guarantor') ? $submission->getRelation('submissionDocs')->whereNull('url')->values() : [];
        $finalOutputFile = $submissionDocsFile->map(function ($doc) {
            $document = $doc->only('name', 'url');
            $document['name'] = $doc->getAttribute('name') ?? '-';
            $document['url'] = Storage::url($doc->getAttribute('url'));

            return $document;
        });

        // get submission pic
        $guarantorPic = $guarantorBranch->getAttribute('pic') ?? $guarantor->getAttribute('pic');

        // get submission time difference period
        $getDifferenceTimePeriod = $submission->getAttribute('difference_time_period');
        $timePeriod = $submission->getAttribute('time_period');

        if ($getDifferenceTimePeriod == -1) {
            $timePeriod -= 1;
        } elseif ($getDifferenceTimePeriod == 1) {
            $timePeriod += 1;
        }

        // get terbilang hari
        $terbilang_hari = $timePeriod ? ucwords(Terbilang::make($timePeriod)) : '';

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
        $productLimit = $submission->getRelation('guarantorProductTypeLimit')
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

        $docsInfo = $supportDocs->map(function ($doc) {
            return "{$doc->name}, Nomor : {$doc->number}, Tanggal {$doc->date}";
        })->implode('; ');

        $isAddedQR = $submission->getAttribute('is_added_qrcode');

        $submission->unsetRelation('submissionDocs');
        $submission->setAttribute('submission_docs', $submissionDocs);
        $submission->setAttribute('mail_number', $mailNumber);
        $submission->setAttribute('blank', $blank);
        $submission->setAttribute('required_docs', $requiredDocs);
        $submission->setAttribute('contract_value_formatted', $contractValueFormatted);
        $submission->setAttribute('guarantee_value_formatted', $guaranteeValueFormatted);
        $submission->setAttribute('analyst_name', $analystName);
        $submission->setAttribute('scoring_result', $scoringResult);
        $submission->setAttribute('analysis', $analysis);
        $submission->setAttribute('terbilang', $terbilang);
        $submission->setAttribute('terbilang_hari', $terbilang_hari);
        $submission->setAttribute('notes', $notes);
        $submission->setAttribute('recommendation', $recommendation);
        $submission->setAttribute('total_score', $totalScore);
        $submission->setAttribute('get_exp', $getExp);
        $submission->setAttribute('get_administators_principal', $getAdministatorsPrincipal);
        $submission->setAttribute('mail_number_resume', $mailNumberResume);
        $submission->setAttribute('start_date', $startDate);
        $submission->setAttribute('end_date', $endDate);
        $submission->setAttribute('submission_date', $submissionDate);
        $submission->setAttribute('guarantee_issue_date', $guaranteeIssueDate);
        $submission->setAttribute('contract_doc_date', $contractDocDate);
        $submission->setAttribute('day_name', $dayName);
        $submission->setAttribute('document_format_analysis', $documentFormatAnalysis);
        $submission->setAttribute('document_format_guarantor', $documentFormatGuarantor);
        $submission->setAttribute('document_format_product', $documentFormatProduct);
        $submission->setAttribute('document_format_type_guarantee', $documentFormatTypeGuarantor);
        $submission->setAttribute('guarantor_address', $guarantorAddress);
        $submission->setAttribute('guarantor_pic', $guarantorPic);
        $submission->setAttribute('employee_limit', $employeeLimit);
        $submission->setAttribute('product_limit', $productLimit);
        $submission->setAttribute('beyond_the_limit', $beyondTheLimit);
        $submission->setAttribute('support_docs', $supportDocs);
        $submission->setAttribute('time_period', $timePeriod);
        $submission->setAttribute('final_output_file', $finalOutputFile);
        $submission->setAttribute('is_added_qrcode', $isAddedQR);
        $submission->setAttribute('submission_support_docs', $docsInfo);

        return inertia('monitoring/submission/detail/index', [
            'submission' => fn () => $submission,
        ]);
    }
}
