<?php

namespace App\Traits;

use App\Enums\SubmissionStatus;
use App\Models\Guarantor\GuarantorRate;
use App\Models\Profile\ProfileRate;
use App\Models\Submission\Submission;
use Exception;
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

    /**
     * @throws Exception
     */
    public function getGuarantorRates(array|int $guarantorId, array|int $guarantorToProductTypeId, array|string $date): Collection
    {
        if (is_array($date)) {
            if (empty($date)) {
                throw new Exception('Date array is empty on calculate guarantor rates');
            }
            $date = collect($date)
                ->filter(fn ($d) => ! is_null($d) && $d !== '') // buang null & string kosong
                ->max(); // bisa tetap null kalau semua kosong
        }

        return GuarantorRate::query()
            ->whereIn('guarantor_id', is_array($guarantorId) ? $guarantorId : [$guarantorId])
            ->whereIn('guarantor_to_product_type_id', is_array($guarantorToProductTypeId) ? $guarantorToProductTypeId : [$guarantorToProductTypeId])
            ->where('effective_at', '<=', $date)
            ->orderByDesc('effective_at')
            ->get();
    }

    public function getGuarantorRate(Collection $guarantorRates, $guarantorId, $guarantorToProductTypeId, $date): ?GuarantorRate
    {
        return $guarantorRates
            ->where('guarantor_id', $guarantorId)
            ->where('guarantor_to_product_type_id', $guarantorToProductTypeId)
            ->where('effective_at', '<=', $date)
            ->sortByDesc('effective_at')
            ->first();
    }

    /**
     * @throws Exception
     */
    public function getProfileRates(array|int $profileId, array|int $guarantorId, array|int $guarantorToProductTypeId, array|string $date): Collection
    {
        if (is_array($date)) {
            if (empty($date)) {
                throw new Exception('Date array is empty on calculate profile rates');
            }
            $date = collect($date)
                ->filter(fn ($d) => ! is_null($d) && $d !== '') // buang null & string kosong
                ->max(); // bisa tetap null kalau semua kosong
        }

        return ProfileRate::query()
            ->whereIn('profile_id', is_array($profileId) ? $profileId : [$profileId])
            ->whereIn('guarantor_id', is_array($guarantorId) ? $guarantorId : [$guarantorId])
            ->whereIn('guarantor_to_product_type_id', is_array($guarantorToProductTypeId) ? $guarantorToProductTypeId : [$guarantorToProductTypeId])
            ->where('effective_at', '<=', $date)
            ->orderByDesc('effective_at')
            ->get();
    }

    public function getProfileRate(Collection $profileRates, $profileId, $guarantorId, $guarantorToProductTypeId, $date): ?ProfileRate
    {
        return $profileRates
            ->where('profile_id', $profileId)
            ->where('guarantor_id', $guarantorId)
            ->where('guarantor_to_product_type_id', $guarantorToProductTypeId)
            ->where('effective_at', '<=', $date)
            ->sortByDesc('effective_at')
            ->first();
    }

    /**
     * @throws Exception
     */
    public function calculateCapitalRates(Submission $submission, Collection $guarantorRates, bool $minus = false): Collection
    {
        $isRevised = $submission->getAttribute('status') == SubmissionStatus::REVISED->value;
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $settingRate = $this->getGuarantorRate(
            $guarantorRates,
            $submission->getAttribute('guarantor_id'),
            $submission->getAttribute('guarantor_to_product_type_id'),
            $submission->getAttribute('send_to_guarantor_at')
        );
        $minimum = (float) $settingRate?->getAttribute('minimum_payment') ?? 0;
        $rate = (float) ($settingRate?->getAttribute('pay_rate') ?? 0) / 100;
        $adm = (float) $settingRate?->getAttribute('payment_administration') ?? 0;
        $brokenRate = (float) $settingRate?->getAttribute('broken_rate') ?? 0;
        $revisedRate = (float) $settingRate?->getAttribute('revised_rate') ?? 0;
        $commission = (float) ($settingRate?->getAttribute('commission') ?? 0) / 100;
        $pph = (float) ($settingRate?->getAttribute('pph') ?? 0) / 100;

        if ($isRevised) {
            $minimum = $revisedRate;
            $rate = 0;
            $adm = 0;
            $commission = 0;
        }

        return $this->extractedCapitalRates($timePeriode, $guaranteeValue, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate, $minus);
    }

    /**
     * @throws Exception
     */
    public function calculateSellingRates(Submission $submission, Collection $profileRates, bool $minus = false): Collection
    {
        // Ensure the submission is fresh to get the latest rates
        $isRevised = $submission->getAttribute('status') == SubmissionStatus::REVISED->value;
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $settingRate = $this->getProfileRate(
            $profileRates,
            $submission->getAttribute('office_id'),
            $submission->getAttribute('guarantor_id'),
            $submission->getAttribute('guarantor_to_product_type_id'),
            $submission->getAttribute('send_to_guarantor_at')
        );
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
            $premi *= -1;
            $adm *= -1;
            $total *= -1;
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
            $premi *= -1;
            $adm *= -1;
            $total *= -1;
            $commissionResult *= -1;
            $pphResult *= -1;
            $nettCommission *= -1;
            $nettPremi *= -1;
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

    /**
     * @throws Exception
     */
    private function mapProductionReport($submissions): Collection
    {
        $result = collect();
        $resultMinus = collect();
        $submissions = collect($submissions);
        if ($submissions->isNotEmpty()) {
            $guarantorIds = $submissions->pluck('guarantor_id')->unique()->toArray();
            $guarantorToProductTypeIds = $submissions->pluck('guarantor_to_product_type_id')->unique()->toArray();
            $officeIds = $submissions->pluck('office_id')->unique()->toArray();
            $hasSendToGuarantorAts = $submissions->pluck('send_to_guarantor_at')->unique()->toArray();
            $guarantorRates = $this->getGuarantorRates($guarantorIds, $guarantorToProductTypeIds, $hasSendToGuarantorAts);
            $officeRates = $this->getProfileRates($officeIds, $guarantorIds, $guarantorToProductTypeIds, $hasSendToGuarantorAts);
            foreach ($submissions as $submission) {
                $submissionBefore = $submission->submissionBefore;
                $submissionAfter = $submission->submissionAfter;

                if ($submissionAfter) {
                    $submission->status = SubmissionStatus::APPROVED->value;
                }

                if ($submissionBefore) {
                    //                  $submissionRevised = clone $submissionBefore;
                    $submissionRevisedMinus = clone $submissionBefore;
                    $submissionRevisedAdd = clone $submissionBefore;
                    //                  $submissionRevised->status = SubmissionStatus::APPROVED->value;
                    $submissionRevisedMinus->status = SubmissionStatus::APPROVED->value;
                    $submissionRevisedAdd->status = SubmissionStatus::REVISED->value;

                    // harus setelah setting status
                    $submissionRevisedMinus->is_add = true;
                    $submissionRevisedMinus->is_minus = true;
                    // $submissionRevised->is_add = true;

                    // $this->setRateSubmission($submissionRevised, $guarantorRates, $officeRates, $result);
                    $this->setRateSubmission($submission, $guarantorRates, $officeRates, $result);
                    $this->setRateSubmission($submissionRevisedMinus, $guarantorRates, $officeRates, $result, true);
                    $this->setRateSubmission($submissionRevisedAdd, $guarantorRates, $officeRates, $result);
                } else {
                    $this->setRateSubmission($submission, $guarantorRates, $officeRates, $result);
                }
            }
        }

        return $result->merge($resultMinus);
    }

    /**
     * @throws Exception
     */
    private function setRateSubmission($submission, $guarantorRates, $officeRates, $result, $isMinus = false): void
    {
        // harus setelah setting status
        $rateJual = $this->calculateSellingRates($submission, $officeRates, $isMinus);
        $rateModal = $this->calculateCapitalRates($submission, $guarantorRates, $isMinus);
        $submission->rate_jual = $rateJual;
        $submission->rate_modal = $rateModal;

        $result->push($submission);
    }
}
