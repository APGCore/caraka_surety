<?php

namespace App\Traits;

use App\Enums\RoleEnum;
use App\Enums\SubmissionStatus;
use App\Models\Document\DocumentFormat;
use App\Models\RelatedParties\Obligee;
use App\Models\RelatedParties\Principal;
use App\Models\Submission\Submission;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Storage;
use Riskihajar\Terbilang\Facades\Terbilang;

trait ReplaceDocumentFormat
{
    use currencyConverter, Numbering;

  /**
   * @throws Exception
   */
  public function convertSubmission(Submission $submission): array
    {
        $submission->load([
            'principal.district',
            'principal.regency',
            'principal.province',
            'obligee.district',
            'obligee.regency',
            'obligee.province',
            'guarantor:id,name',
            'guarantorBranch.district',
            'guarantorBranch.regency',
            'guarantorBranch.province',
            'guarantorToProductType',
            'sourceOfFund',
            'scores.scoringQuestionCategory',
            'product',
            'district',
            'regency',
            'province',
            'staff.head.head',
            'supportDocs',
            // 'bankBranch',
        ]);
        $principal = $submission->getRelation('principal');
        $principalDistrict = $principal->getRelation('district');
        $principalRegency = $principal->getRelation('regency');
        $principalProvince = $principal->getRelation('province');
        $obligee = $submission->getRelation('obligee');
        $obligeeDistrict = $obligee->getRelation('district');
        $obligeeRegency = $obligee->getRelation('regency');
        $obligeeProvince = $obligee->getRelation('province');
        $guarantor = $submission->getRelation('guarantor');
        $guarantorBranch = $submission->getRelation('guarantorBranch');
        $guarantorBranchDistrict = $guarantorBranch->getRelation('district');
        $guarantorBranchRegency = $guarantorBranch->getRelation('regency');
        $guarantorBranchProvince = $guarantorBranch->getRelation('province');
        $guarantorToProductType = $submission->getRelation('guarantorToProductType');
        $sourceOfFund = $submission->getRelation('sourceOfFund');
        $scores = $submission->getRelation('scores');
        $district = $submission->getRelation('district');
        $regency = $submission->getRelation('regency');
        $province = $submission->getRelation('province');
        $product = $submission->getRelation('product');
        $staff = $submission->getRelation('staff');
        $headStaff = $staff->getRelation('head');
        if ($headStaff->hasRole(RoleEnum::KepalaCabang->value)) {
            $headStaff = $headStaff->getRelation('head');
        }
        $supportDocs = $submission->getRelation('supportDocs');
        // $bankBranch = $submission->getRelation('bankBranch');

        $contractValueFormatted = $this->formatCurrency($submission->getAttribute('contract_value'));
        $guaranteeValueFormatted = $this->formatCurrency($submission->getAttribute('guarantee_value'));
        $supportDocs = $supportDocs->map(function ($doc) {
            $doc->setAttribute('name', $doc->getAttribute('name') ?? '-');
            $doc->setAttribute('number', $doc->getAttribute('number') ?? '-');
            $doc->setAttribute('date', $doc->getAttribute('date') ? Carbon::parse($doc->getAttribute('date'))->translatedFormat('d F Y') : null);
            if ($doc->getAttribute('url')) {
                $doc->setAttribute('url', Storage::url($doc->getAttribute('url')));
            }

            return $doc;
        });
        $guaranteeValue = $submission->getAttribute('guarantee_value');
        // get submission time difference period
        $getDifferenceTimePeriod = $submission->getAttribute('difference_time_period');
        $timePeriod = $submission->getAttribute('time_period');

        if ($getDifferenceTimePeriod == -1) {
            $timePeriod -= 1;
        } elseif ($getDifferenceTimePeriod == 1) {
            $timePeriod += 1;
        }

        // get terbilang
        $terbilang = $guaranteeValue ? ucwords(Terbilang::make($guaranteeValue, ' Rupiah')) : '';
        $terbilangHari = $timePeriod ? ucwords(Terbilang::make($timePeriod)) : '';

        // SCORING RESULT
        $analysis = ['character' => 0, 'capacity' => 0, 'capital' => 0, 'condition' => 0, 'collateral' => 0];

        $scores->reduce(function ($grouped, $score) use (&$analysis) {
            $categoryId = $score->getAttribute('scoring_question_category_id');
            $categoryName = $score->getRelation('scoringQuestionCategory')->getAttribute('name');

            $grouped[$categoryId] ??= [
                'id' => $categoryId,
                'name' => $categoryName,
                'items' => [],
            ];

            $grouped[$categoryId]['items'][] = $score;
            $point = $score->getAttribute('point') ?? 0;

            if (isset($analysis[strtolower($categoryName)])) {
                $analysis[strtolower($categoryName)] += $point;
            }

            return $grouped;
        }, []);

        $totalScore = $scores->sum('point') ?? 0;
        if ($totalScore > 60 && $totalScore < 100) {
            $notes = 'Dipertimbangkan untuk disetujui';
            $recommendation = 'disetujui';
        } else {
            $notes = $totalScore <= 60
              ? 'Dipertimbangkan untuk ditambahkan mitigasi risiko'
              : 'Skoring tidak valid';
            $recommendation = 'ditolak';
        }

        return [
            'principal_name' => $principal->name ?? '...',
            'location' => $principal->address ?? '...',
            'npwp' => $principal->npwp ?? '...',
            'nib' => $principal->nib ?? '...',
            'telephone' => $principal->telephone ?? '...',
            'director_name' => $principal->director_name ?? '...',
            'director_phone' => $principal->director_phone ?? '...',
            'bussiness_field' => $principal->bussiness_field ?? '...',
            'principal_commissioner' => $principal->commissioner ?? '...',
            'pic' => $principal->pic ?? '...',
            'director_position' => $principal->director_position ?? '...',
            'principal_address' => $principal->address ?? '...',
            'principal_location' => "$principal->address, $principalDistrict->name, $principalRegency->name, $principalProvince->name",
            'est_deed' => $principal->est_deed ?? '...',
            'last_deed' => $principal->last_deed ?? '...',
            'get_exp' => $this->getExp($principal, $obligee),
            'get_susunan_pengurus' => $this->getAdministratorsPrincipal($principal),
            'bank_name' => $submission->bank_name ?? '...',
            'obligee_name' => $obligee->name ?? '...',
            'obligee_city' => $obligee->district->name ?? '...',
            'obligee_address' => $obligee->address ?? '...',
            'obligee_location' => "$obligee->address, $obligeeDistrict->name, $obligeeRegency->name, $obligeeProvince->name",
            'source_of_fund' => $submission->getRelation('source_of_fund')?->name ?? '...',
            'ppk_name' => $obligee->pic ?? '...',
            'ppk_number' => $obligee->no_ppk ?? '...',
            'guarantor_name' => $guarantor->name ?? '...',
            'guarantor_address' => $guarantorBranch->address ?? '...',
            'guarantor_pic' => $guarantorBranch->pic ?? '...',
            'guarantor_location' => "$guarantorBranch->address, ".
              "$guarantorBranchDistrict->name, ".
              "$guarantorBranchRegency->name, ".
              "$guarantorBranchProvince->name",
            'guarantor_city' => $guarantorBranchDistrict->name ?? '...',
            'source_of_fund_name' => $sourceOfFund->name ?? '...',
            'contract_value' => $contractValueFormatted,
            'guarantee_value' => $guaranteeValueFormatted,
            'guarantee_type' => $guarantorToProductType->name ?? '...',
            'no_guarantee' => $submission->getAttribute('status') === SubmissionStatus::PROCESS->value ? str_pad('X', 16, 'X') : $submission->no_guarantee ?? '...',
            'time_period' => $timePeriod ?? '...',
            'job_name' => $submission->job_name ?? '...',
            'job_location_village' => $submission->job_location_village ?? '...',
            'contract_doc_name' => $supportDocs->pluck('name')->implode(', ') ?? '...',
            'contract_doc_number' => $supportDocs->pluck('number')->implode(', ') ?? '...',
            'contract_doc_date' => $supportDocs->pluck('date')->implode(', ') ?? '...',
            'start_date' => $submission->getAttribute('start_date') ? Carbon::parse($submission->getAttribute('start_date'))->translatedFormat('d F Y') : '...',
            'end_date' => $submission->getAttribute('end_date') ? Carbon::parse($submission->getAttribute('end_date'))->translatedFormat('d F Y') : '...',
            'guarantee_issue_date' => Carbon::parse($submission->getAttribute('approved_at'))->translatedFormat('d F Y') ?? '...',
            'submission_date' => Carbon::parse($submission->getAttribute('created_at'))->translatedFormat('d F Y') ?? '...',
            'day' => Carbon::parse($submission->getAttribute('approved_at'))->translatedFormat('l'),
            'recommendation' => $recommendation,
            'notes' => $notes,
            'analyst_name' => $staff->getAttribute('name') ?? '...',
            'manager_technique_name' => $headStaff?->getAttribute('name') ?? '...',
            'branch_manager' => $principal->director_name ?? '...',
            'job_location' => "{$submission->getAttribute('job_location_village')}, $district->name, $regency->name, $province->name",
            'job_group' => $guarantorToProductType->job_group ?? '...',
            'no' => $submission->id ?? '...',
            'city' => $submission->regency->name ?? '...',
            'mail_number' => $this->generateNomorSurat($submission),
            'mail_number_resume' => $this->generateNomorSuratResume($submission->getAttribute('id'), $submission->getAttribute('created_at')),
            'underlying' => ($submission->getAttribute('contract_doc_name').' '.$submission->getAttribute('contract_doc_number').' '.$submission->getAttribute('job_name')) ?? '...',
            'product_name' => $product->name ?? '...',
            'submission_support_docs' => $supportDocs->map(function ($doc) {
                return "$doc->name, Nomor : $doc->number, Tanggal $doc->date";
            })->implode('; ') ?? '...',
            'terbilang' => $terbilang,
            'terbilang_hari' => $terbilangHari,
            'contract_value_formatted' => $this->formatCurrency($submission->getAttribute('contract_value')),
            'guarantee_value_formatted' => $this->formatCurrency($submission->getAttribute('guarantee_value')),
            'character_score' => $analysis['character'],
            'capacity_score' => $analysis['capacity'],
            'capital_score' => $analysis['capital'],
            'collateral_score' => $analysis['collateral'],
            'condition_score' => $analysis['condition'],
            'total_score' => $totalScore,
            'publication_place' => $submission->getAttribute('publication_place') ?? '...',
            'publication_date' => $submission->getAttribute('publication_date') ? Carbon::parse($submission->getAttribute('publication_date'))->translatedFormat('d F Y') : '...',
            // 'bank_branch_name' => $bankBranch->name ?? '...',
        ];
    }

    public function replaceDocumentFormat(DocumentFormat $documentFormat, array $data)
    {
        $html = $documentFormat->getAttribute('format_document');

        if (! $html) {
            abort(404, 'Konten HTML tidak tersedia.');
        }

        foreach ($data as $key => $value) {
            $uppercaseValue = strtoupper($key);
            $html = str_replace('['.$uppercaseValue.']', $value, $html);
        }

        return $html;
    }

    private function getExp(Principal $principal, Obligee $obligee): string
    {
        $approvedSubmissionsExp = Submission::query()
            ->where('status', 'approved')
            ->where(function ($query) use ($principal, $obligee) {
                $query->where('principal_id', $principal->getAttribute('id'))
                    ->orWhere('obligee_id', $obligee->getAttribute('id'));
            })
            ->with('obligee')
            ->get()
            ->map(function ($submission, $index) use ($obligee) {
                $no = $index + 1;
                $obligeeName = $obligee->getAttribute('name');
                $contractValue = number_format($submission->contract_value, 0, ',', '.');
                $approvedAt = date('Y', strtotime($submission->approved_at));

                return
                  "<tr style='text-align: left;'>
                    <td style='text-align: center;'>$no</td>
                    <td>$obligeeName</td>
                    <td>$submission->job_name</td>
                    <td>Rp. $contractValue</td>
                    <td>$approvedAt</td>
                  </tr>";
            })->implode('');

        $principalName = $principal->getAttribute('name');

        return "<table style='width: 100%; border-collapse: collapse; text-align: center;' border='1'>
            <tr>
                <td colspan='5' style='border-left: 1px solid black; border-right: 1px solid black; text-align: center;'>
                    <strong>PENGALAMAN KERJA</strong>
                </td>
            </tr>
            <tr>
                <td colspan='5' style='text-align:left'>
                    <strong>Berikut Pengalaman Kerja $principalName</strong>
                </td>
            </tr>
            <tr>
                <th>No</th>
                <th>Obligee</th>
                <th>Nama Proyek</th>
                <th>Nilai Proyek</th>
                <th>Tahun</th>
            </tr>
            $approvedSubmissionsExp
        </table>";
    }

    private function getAdministratorsPrincipal(Principal $principal): string
    {
        // GET SUSUNAN PENGURUS
        $pengurus = collect();

        $roles = [
            ['attr' => 'director_name', 'jabatan' => 'Direktur'],
            ['attr' => 'commissioner', 'jabatan' => 'Komisaris'],
            ['attr' => 'head_name', 'jabatan' => 'Kepala Cabang'],
        ];

        foreach ($roles as $role) {
            $value = $principal->getAttribute($role['attr']);
            if ($value) {
                $pengurus->push(['nama' => $value, 'jabatan' => $role['jabatan']]);
            }
        }

        $susunanPengurus = $pengurus->map(fn ($p, $i) => "
      <tr>
        <td style='text-align: center; vertical-align: middle;'>".($i + 1)."</td>
        <td>{$p['nama']}</td>
        <td>{$p['jabatan']}</td>
      </tr>
    ")->implode('');

        return
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
    }
}
