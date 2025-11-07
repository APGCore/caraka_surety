<?php

namespace App\Traits;

use App\Enums\SubmissionStatus;
use App\Models\Submission\Submission;
use Illuminate\Support\Collection;

trait CalculateInvoice
{
    public function calculateGuarantor(Submission $submission): Collection
    {
        $submission->load([
            'guarantor.guarantorRate' => fn ($query) => $query->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id')),
        ]);
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $guarantor = $submission->getRelation('guarantor');
        $guarantorRate = $guarantor?->getRelation('guarantorRate')->first();
        $minimum = (float) $guarantorRate?->getAttribute('minimum_payment') ?? 0;
        $rate = (float) ($guarantorRate?->getAttribute('pay_rate') ?? 0) / 100;
        $adm = (float) $guarantorRate?->getAttribute('payment_administration') ?? 0;
        $brokenRate = (float) $guarantorRate?->getAttribute('broken_rate') ?? 0;
        $revisedRate = (float) $guarantorRate?->getAttribute('revised_rate') ?? 0;
        $commission = (float) ($guarantorRate?->getAttribute('commission') ?? 0) / 100;
        $pph = (float) ($guarantorRate?->getAttribute('pph') ?? 0) / 100;

        return $this->extractedCapitalRates($timePeriode, $guaranteeValue, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate);
    }

    public function calculateOffice(Submission $submission): Collection
    {
        $submission->load([
            'office.profileRate' => fn ($query) => $query->where('guarantor_id', $submission->getAttribute('guarantor_id'))
                ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id')),
        ]);
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $office = $submission->getRelation('office');
        $profileRate = $office->getRelation('profileRate')->first();

        $minimum = (float) ($profileRate?->getAttribute('minimum_bill') ?? 0);
        $rate = (float) ($profileRate?->getAttribute('selling_rate') ?? 0);
        $adm = (float) ($profileRate?->getAttribute('sales_administration') ?? 0);
        $brokenRate = (float) ($profileRate?->getAttribute('broken_rate') ?? 0);
        $revisedRate = (float) ($profileRate?->getAttribute('revised_rate') ?? 0);

        return $this->extractedSellingRates($guaranteeValue, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
    }

    public function calculatePrincipal(Submission $submission): Collection
    {
        $submission->load([
            'principal.principalRate' => fn ($query) => $query->where('profile_id', $submission->getAttribute('office_id'))
                ->where('guarantor_id', $submission->getAttribute('guarantor_id'))
                ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id')),
        ]);
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $principalRate = $submission->getRelation('principal')?->getRelation('principalRate')->first();
        $minimum = (float) ($principalRate?->getAttribute('minimum_bill') ?? 0);
        $rate = (float) ($principalRate?->getAttribute('selling_rate') ?? 0);
        $adm = (float) ($principalRate?->getAttribute('sales_administration') ?? 0);
        $brokenRate = (float) ($principalRate?->getAttribute('broken_rate') ?? 0);
        $revisedRate = (float) ($principalRate?->getAttribute('revised_rate') ?? 0);

        return $this->extractedSellingRates($guaranteeValue, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
    }

    public function calculateCapitalRates(Submission $submission, bool $minus = false): Collection
    {
        $submission->load([
            'guarantor.guarantorRate' => fn ($query) => $query->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id')),
        ]);
        $isRevised = $submission->getAttribute('status') == SubmissionStatus::REVISED->value;
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $guarantor = $submission->getRelation('guarantor');
        $guarantorRate = $guarantor?->getRelation('guarantorRate')->first();
        $minimum = (float) $guarantorRate?->getAttribute('minimum_payment') ?? 0;
        $rate = (float) ($guarantorRate?->getAttribute('pay_rate') ?? 0) / 100;
        $adm = (float) $guarantorRate?->getAttribute('payment_administration') ?? 0;
        $brokenRate = (float) $guarantorRate?->getAttribute('broken_rate') ?? 0;
        $revisedRate = (float) $guarantorRate?->getAttribute('revised_rate') ?? 0;
        $commission = (float) ($guarantorRate?->getAttribute('commission') ?? 0) / 100;
        $pph = (float) ($guarantorRate?->getAttribute('pph') ?? 0) / 100;

        if ($isRevised) {
            $minimum = $revisedRate;
            $rate = 0;
            $adm = 0;
            $commission = 0;
        }

        return $this->extractedCapitalRates($timePeriode, $guaranteeValue, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate, $minus);
    }

    public function calculateSellingRates(Submission $submission, bool $minus = false): Collection
    {
        $submission->load([
            'office.profileRate' => fn ($query) => $query->where('guarantor_id', $submission->getAttribute('guarantor_id'))
                ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id')),
        ]);
        // Ensure the submission is fresh to get the latest rates
        $isRevised = $submission->getAttribute('status') == SubmissionStatus::REVISED->value;
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $settingRate = $submission->getRelation('office')?->getRelation('profileRate')->first();
        $minimum = (float) ($settingRate?->getAttribute('minimum_bill') ?? 0);
        $rate = (float) ($settingRate?->getAttribute('selling_rate') ?? 0);
        $adm = (float) ($settingRate?->getAttribute('sales_administration') ?? 0);
        $brokenRate = (float) ($settingRate?->getAttribute('broken_rate') ?? 0);
        $revisedRate = (float) ($settingRate?->getAttribute('revised_rate') ?? 0);

        if ($isRevised) {
            $minimum = 0;
            $rate = 0;
            $adm = $revisedRate;
        }

        return $this->extractedSellingRates($guaranteeValue, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate, $minus);
    }

    private function extractedSellingRates(float $guaranteeValue, float|int $rate, int $timePeriode, float $adm, float|int $minimum, float $brokenRate, float $revisedRate, bool $minus = false): Collection
    {
        $subService = $guaranteeValue * ($rate / 100);
        $serviceCharges = $timePeriode > 90 ? ($subService * $timePeriode) / 90 : $subService;
        $total = max(($serviceCharges + $adm), $minimum);
        $premi = max($serviceCharges, $minimum);

        if ($minus) {
            $minimum *= -1;
            $serviceCharges *= -1;
            $total *= -1;
            $premi *= -1;
        }

        return collect([
            'minimum' => $minimum,
            'rate' => $rate,
            'adm' => $adm,
            'broken_rate' => $brokenRate,
            'revised_rate' => $revisedRate,
            'service_charges' => $serviceCharges,
            'total' => $total,
            'premi' => $premi,
        ]);
    }

    private function extractedCapitalRates(int $timePeriode, float $guaranteeValue, float $rate, float|int $minimum, float|int $adm, float $commission, float $pph, float|int $brokenRate, float|int $revisedRate, bool $minus = false): Collection
    {
        $serviceCharges = (float) $timePeriode > 91 ? (($guaranteeValue * $rate * $timePeriode) / 91) : ($guaranteeValue * $rate);
        $premi = max($serviceCharges, $minimum);
        $total = max(($adm + $serviceCharges), ($adm + $premi));
        $commissionResult = $commission * $premi;
        $pphResult = $pph * $commissionResult;
        $nettCommission = $commissionResult - $pphResult;
        $nettPremi = $total - $nettCommission;
        if ($minus) {
            $minimum *= -1;
            $serviceCharges *= -1;
            $total *= -1;
            $premi *= -1;
        }

        return collect([
            'minimum' => $minimum,
            'rate' => $rate * 100,
            'adm' => $adm,
            'broken_rate' => $brokenRate,
            'revised_rate' => $revisedRate,
            'percent_commission' => $commission * 100,
            'percent_pph' => $pph * 100,
            'service_charges' => $serviceCharges,
            'premi' => $premi,
            'total' => $total,
            'commission' => $commissionResult,
            'pph_commission' => $pphResult,
            'nett_commission' => $nettCommission,
            'nett_premi' => $nettPremi,
        ]);
    }

    private function mapProductionReport($submissions): Collection
    {
        $result = collect();
        $resultMinus = collect();
        foreach ($submissions as $submission) {
            $submissionBefore = $submission->submissionBefore;
            $submissionAfter = $submission->submissionAfter;

            if ($submissionAfter) {
                $submission->status = SubmissionStatus::APPROVED->value;
            }

            if ($submissionBefore) {
                $submissionRevised = clone $submissionBefore;
                $submissionRevisedMinus = clone $submissionBefore;
                $submissionRevised->status = SubmissionStatus::APPROVED->value;
                $submissionRevisedMinus->status = SubmissionStatus::APPROVED->value;

                // harus setelah setting status
                $rateJualRevised = $this->calculateSellingRates($submissionRevised);
                $rateModalRevised = $this->calculateCapitalRates($submissionRevised);
                $submissionRevised->rate_jual = $rateJualRevised;
                $submissionRevised->rate_modal = $rateModalRevised;

                $rateJualBeforeMinus = $this->calculateSellingRates($submissionRevisedMinus, true);
                $rateModalBeforeMinus = $this->calculateCapitalRates($submissionRevisedMinus, true);
                $submissionRevisedMinus->rate_jual = $rateJualBeforeMinus;
                $submissionRevisedMinus->rate_modal = $rateModalBeforeMinus;
                $submissionRevisedMinus->is_add = true;
                $submissionRevisedMinus->is_minus = true;

                $submission->is_add = true;
                $submission->status = SubmissionStatus::REVISED->value;

                $result->push($submissionRevised);
                $resultMinus->push($submissionRevisedMinus);
            }

            $this->setRateSubmission($submission, $result);
        }

        return $result->merge($resultMinus);
    }

    private function setRateSubmission($submission, $result): void
    {
        // harus setelah setting status
        $rateJual = $this->calculateSellingRates($submission);
        $rateModal = $this->calculateCapitalRates($submission);
        $submission->rate_jual = $rateJual;
        $submission->rate_modal = $rateModal;

        $result->push($submission);
    }
}
