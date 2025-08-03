<?php

namespace App\Traits;

use App\Enums\SubmissionStatus;
use App\Models\Submission\Submission;
use Illuminate\Support\Collection;

trait CalculateInvoice
{
    public function calculateGuarantor(Submission $submission): Collection
    {
        $submission->loadMissing(['guarantor.guarantorRate']);
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $guarantor = $submission->getRelation('guarantor');
        $guarantorRate = $guarantor?->getRelation('guarantorRate')
            ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
            ->first();
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
        $submission->loadMissing(['office.profileRate']);
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $office = $submission->getRelation('office');
        $profileRate = $office->getRelation('profileRate')
            ->where('guarantor_id', $submission->getAttribute('guarantor_id'))
            ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
            ->first();

        $minimum = (float) ($profileRate?->getAttribute('minimum_bill') ?? 0);
        $rate = (float) ($profileRate?->getAttribute('selling_rate') ?? 0);
        $adm = (float) ($profileRate?->getAttribute('sales_administration') ?? 0);
        $brokenRate = (float) ($profileRate?->getAttribute('broken_rate') ?? 0);
        $revisedRate = (float) ($profileRate?->getAttribute('revised_rate') ?? 0);

        return $this->extractedSellingRates($guaranteeValue, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
    }

    public function calculatePrincipal(Submission $submission): Collection
    {
        $submission->loadMissing(['principal.principalRate', 'staff']);
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $staff = $submission->getRelation('staff');
        $principalRate = $submission->getRelation('principal')?->getRelation('principalRate')
            ->where('profile_id', $staff->getAttribute('profile_id'))
            ->where('guarantor_id', $submission->getAttribute('guarantor_id'))
            ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
            ->first();
        $minimum = (float) ($principalRate?->getAttribute('minimum_bill') ?? 0);
        $rate = (float) ($principalRate?->getAttribute('selling_rate') ?? 0);
        $adm = (float) ($principalRate?->getAttribute('sales_administration') ?? 0);
        $brokenRate = (float) ($principalRate?->getAttribute('broken_rate') ?? 0);
        $revisedRate = (float) ($principalRate?->getAttribute('revised_rate') ?? 0);

        return $this->extractedSellingRates($guaranteeValue, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
    }

    public function calculateCapitalRates(Submission $submission): Collection
    {
        $submission->loadMissing(['guarantor.guarantorRate', 'submissionRate']);
        $isRevised = $submission->getAttribute('status') == SubmissionStatus::REVISED->value;
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $guarantor = $submission->getRelation('guarantor');
        $guarantorRate = $guarantor?->getRelation('guarantorRate')
            ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
            ->first();
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

        return $this->extractedCapitalRates($timePeriode, $guaranteeValue, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate);
    }

    public function calculateSellingRates(Submission $submission): Collection
    {
        $submission->loadMissing(['submissionRate']);
        // Ensure the submission is fresh to get the latest rates
        $isRevised = $submission->getAttribute('status') == SubmissionStatus::REVISED->value;
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $settingRate = $submission->getRelation('submissionRate');
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

        return $this->extractedSellingRates($guaranteeValue, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
    }

    private function extractedSellingRates(float $guaranteeValue, float|int $rate, int $timePeriode, float $adm, float|int $minimum, float $brokenRate, float $revisedRate): Collection
    {
        $subService = $guaranteeValue * ($rate / 100);
        $serviceCharges = $timePeriode > 90 ? ($subService * $timePeriode) / 90 : $subService;
        $total = max(($serviceCharges + $adm), $minimum);

        return collect([
            'minimum' => $minimum,
            'rate' => $rate,
            'adm' => $adm,
            'broken_rate' => $brokenRate,
            'revised_rate' => $revisedRate,
            'service_charges' => $serviceCharges,
            'total' => $total,
        ]);
    }

    private function extractedCapitalRates(int $timePeriode, float $guaranteeValue, float $rate, float|int $minimum, float|int $adm, float $commission, float $pph, float|int $brokenRate, float|int $revisedRate): Collection
    {
        $serviceCharge = (float) $timePeriode > 91 ? (($guaranteeValue * $rate * $timePeriode) / 91) : ($guaranteeValue * $rate);
        $premi = max($serviceCharge, $minimum);
        $total = max(($adm + $serviceCharge), ($adm + $premi));
        $commissionResult = $commission * $premi;
        $pphResult = $pph * $commissionResult;
        $nettCommission = $commissionResult - $pphResult;
        $nettPremi = $total - $nettCommission;

        return collect([
            'minimum' => $minimum,
            'rate' => $rate * 100,
            'adm' => $adm,
            'broken_rate' => $brokenRate,
            'revised_rate' => $revisedRate,
            'percent_commission' => $commission * 100,
            'percent_pph' => $pph * 100,

            // result
            'service_charges' => $serviceCharge,
            'premi' => $premi,
            'total' => $total,
            'commission' => $commissionResult,
            'pph_commission' => $pphResult,
            'nett_commission' => $nettCommission,
            'nett_premi' => $nettPremi,
        ]);
    }
}
