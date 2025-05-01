<?php

namespace App\Traits;

use App\Models\Submission\Submission;
use Illuminate\Support\Collection;

trait CalculateInvoice
{
    private function calculateForCentralOffice(Submission $submission): Collection
    {
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $office = $submission->getRelation('staff')->getRelation('office');
        $profileRate = collect($office->getRelation('profileRate'))
            ->where('guarantor_id', $submission->getAttribute('guarantor_id'))
            ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
            ->first();

        $managementFee = (float) ($profileRate?->getAttribute('management_fee') ?? 0) / 100;
        $minimum = (float) $profileRate?->getAttribute('minimum_management_fee') ?? 0;
        $serviceChargeCentral = (float) $timePeriode > 90 ? (($guaranteeValue * $managementFee * ($timePeriode + 1)) / 90) : ($guaranteeValue * $managementFee);
        $totalCentral = max($serviceChargeCentral, $minimum);

        return collect([
            'minimum' => $minimum,
            'management_fee' => $managementFee,
            'service_charge_central' => round($serviceChargeCentral, 2),
            'total_central' => round($totalCentral, 2),
        ]);
    }

    private function calculateForBranchOffice(Submission $submission): Collection
    {
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $office = $submission->getRelation('staff')->getRelation('office');
        $profileRate = collect($office->getRelation('profileRate'))
            ->where('guarantor_id', $submission->getAttribute('guarantor_id'))
            ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
            ->first();

        $minimumBill = (float) $profileRate?->getAttribute('minimum_bill') ?? 0;
        $sellingRate = (float) ($profileRate?->getAttribute('selling_rate') ?? 0) / 100;
        $salesAdministration = (float) $profileRate?->getAttribute('sales_administration') ?? 0;
        $serviceChargeBranch = $timePeriode > 90 ? (($guaranteeValue * $sellingRate * ($timePeriode + 1)) / 90) : ($guaranteeValue * $sellingRate);
        $subtotalBranch = $salesAdministration + $serviceChargeBranch;
        $totalBranch = max($subtotalBranch, $minimumBill);

        return collect([
            'minimum_bill' => $minimumBill,
            'selling_rate' => $sellingRate,
            'sales_administration' => $salesAdministration,
            'service_charge_branch' => round($serviceChargeBranch, 2),
            'total_branch' => round($totalBranch, 2),
        ]);
    }

    public function calculateForGuarantor(Submission $submission): Collection
    {
        // calculate for guarantor
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $guarantor = $submission->getRelation('guarantor');
        $guarantorRate = collect($guarantor?->guarantorRate)->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))->first();
        $minimumPayment = (float) $guarantorRate?->minimum_payment ?? 0;
        $payRate = (float) ($guarantorRate?->pay_rate ?? 0) / 100;
        $payAdm = (float) $guarantorRate?->payment_administration ?? 0;
        $stampDuty = (float) $guarantorRate?->stamp_duty ?? 0;
        $brokenRate = (float) $guarantorRate?->stamp_duty ?? 0;
        $revisedRate = (float) $guarantorRate?->revised_rate ?? 0;
        $serviceCharge = $timePeriode > 90 ? ($guaranteeValue * $payRate * $timePeriode) / 90 : $guaranteeValue * $payRate;
        $subtotal = $serviceCharge + $payAdm + $stampDuty;
        $total = max($subtotal, $minimumPayment);

        return collect([
            'minimum_payment' => $minimumPayment,
            'pay_rate' => $payRate,
            'payment_administration' => $payAdm,
            'stamp_duty' => $stampDuty,
            'broken_rate' => $brokenRate,
            'revised_rate' => $revisedRate,
            'service_charge' => round($serviceCharge, 2),
            'total' => round($total, 2),
        ]);
    }

    public function calculateOffice(Submission $submission): Collection
    {
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $office = $submission->getRelation('staff')->getRelation('office');
        $profileRate = collect($office->getRelation('profileRate'))
            ->where('guarantor_id', $submission->getAttribute('guarantor_id'))
            ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
            ->first();

        $minimum = (float) ($profileRate?->getAttribute('minimum_bill') ?? 0);
        $rate = (float) ($profileRate?->getAttribute('selling_rate') ?? 0) / 100;
        $adm = (float) ($profileRate?->getAttribute('sales_administration') ?? 0);
        $subService = $guaranteeValue * $rate;
        $serviceCharges = $timePeriode > 90 ? ($subService * $timePeriode) / 90 : $subService;
        $total = max(($serviceCharges + $adm), $minimum);

        return collect([
            'minimum' => $minimum,
            'rate' => $rate * 100,
            'adm' => $adm,
            'service_charges' => $serviceCharges,
            'total' => $total,
        ]);
    }

    public function calculateGuarantor(Submission $submission): Collection
    {
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $guarantor = $submission->getRelation('guarantor');
        $guarantorRate = $guarantor?->guarantorRate
            ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
            ->first();
        $minimum = (float) $guarantorRate?->getAttribute('minimum_payment') ?? 0;
        $rate = (float) ($guarantorRate?->getAttribute('pay_rate') ?? 0) / 100;
        $adm = (float) $guarantorRate?->getAttribute('payment_administration') ?? 0;
        $commission = (float) ($guarantorRate?->getAttribute('commission') ?? 0) / 100;
        $pph = (float) ($guarantorRate?->getAttribute('pph') ?? 0) / 100;

        $serviceCharge = (float) $timePeriode > 91 ? (($guaranteeValue * $rate * $timePeriode) / 91) : ($guaranteeValue * $rate);
        $premi = max($serviceCharge, $minimum);
        $total = max(($adm + $serviceCharge), ($adm + $premi));
        $commission *= $premi;
        $pph *= $commission;
        $nettCommission = $commission - $pph;
        $nettPremi = $total - $nettCommission;

        return collect([
            'minimum' => $minimum,
            'rate' => $rate * 100,
            'adm' => $adm,
            'service_charges' => $serviceCharge,
            'premi' => $premi,
            'total' => $total,
            'commission' => $commission,
            'pph_commission' => $pph,
            'nett_commission' => $nettCommission,
            'nett_premi' => $nettPremi,
        ]);
    }
}
