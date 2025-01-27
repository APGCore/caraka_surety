<?php

namespace App\Traits;

use App\Models\Submission\Submission;
use Illuminate\Support\Collection;

trait CalculateInvoice
{
    public function calculateForOffice(
        Submission $submission
    ): Collection {
        // time_priode > 90
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $office = $submission->getRelation('staff')->getRelation('office');
        $profileRate = collect($office->getRelation('profileRate'))
            ->where('guarantor_id', $submission->getAttribute('guarantor_id'))
            ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
            ->first();
        // calculate for central office
        $managementFee = (float) ($profileRate?->getAttribute('management_fee') ?? 0) / 100;
        $minimum = (float) $profileRate?->getAttribute('minimum_management_fee') ?? 0;
        $serviceChargeCentral = (float) $timePeriode > 90 ? ($guaranteeValue * $managementFee * 90) : ($guaranteeValue * $managementFee);
        $totalCentral = min($serviceChargeCentral, $minimum);

        // calculate for branch office
        $minimumBill = (float) $profileRate?->getAttribute('minimum_bill') ?? 0;
        $sellingRate = (float) ($profileRate?->getAttribute('selling_rate') ?? 0) / 100;
        $salesAdministration = (float) $profileRate?->getAttribute('sales_administration') ?? 0;
        $serviceChargeBranch = $timePeriode > 90 ? (($guaranteeValue * $sellingRate * ($timePeriode + 1)) / 90) : ($guaranteeValue * $sellingRate);
        $totalBranch = $salesAdministration + $serviceChargeBranch > $minimumBill ? ($serviceChargeBranch + $salesAdministration) : $minimumBill;

        return collect([
            'minimum' => $minimum,
            'management_fee' => $managementFee,
            'service_charge_central' => round($serviceChargeCentral, 2),
            'total_central' => round($totalCentral, 2),

            'minimum_bill' => $minimumBill,
            'selling_rate' => $sellingRate,
            'sales_administration' => $salesAdministration,
            'service_charge_branch' => round($serviceChargeBranch, 2),
            'total_branch' => round($totalBranch, 2),
        ]);
    }

    public function calculateForGuarantor(
        Submission $submission
    ): Collection {
        // calculate for guarantor
        $timePeriode = (int) $submission->getAttribute('time_period');
        $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
        $guarantor = $submission->getRelation('guarantor');
        dd($guarantor);
        $serviceCharge = $timePeriode > 90;
    }
}
