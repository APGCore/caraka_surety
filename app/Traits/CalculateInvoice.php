<?php

namespace App\Traits;

use Carbon\Carbon;
use App\Enums\SubmissionStatus;
use Illuminate\Support\Collection;
use App\Models\Submission\Submission;

trait CalculateInvoice
{
  public function calculateGuarantor(Submission $submission): Collection
  {
    if ($submission->getAttribute('submission_before_id') !== null) {
      $newSubmission = null;
      $oldSubmission = null;

      $newSubmission = $submission;
      $oldSubmission = Submission::find($newSubmission->getAttribute('submission_before_id'));

      $oldDate = Carbon::parse($oldSubmission->getAttribute('send_to_guarantor_at'));
      $newDate = Carbon::parse($newSubmission->getAttribute('send_to_guarantor_at'));

      $oldPeriod = $this->getPeriod($oldDate);
      $newPeriod = $this->getPeriod($newDate);

      $isSamePeriod = $oldDate->month === $newDate->month
        && $oldDate->year === $newDate->year
        && $oldPeriod === $newPeriod;

      $newSubmission->loadMissing(['guarantor.guarantorRate']);
      $timePeriode = (int) $newSubmission->getAttribute('time_period');
      $guarantor = $newSubmission->getRelation('guarantor');
      $guarantorRate = $guarantor?->getRelation('guarantorRate')
        ->where('guarantor_to_product_type_id', $newSubmission->getAttribute('guarantor_to_product_type_id'))
        ->first();

      $minimum = (float) $guarantorRate?->getAttribute('minimum_payment') ?? 0;
      $rate = (float) ($guarantorRate?->getAttribute('pay_rate') ?? 0) / 100;
      $adm = (float) $guarantorRate?->getAttribute('payment_administration') ?? 0;
      $brokenRate = (float) $guarantorRate?->getAttribute('broken_rate') ?? 0;
      $revisedRate = (float) $guarantorRate?->getAttribute('revised_rate') ?? 0;
      $commission = (float) ($guarantorRate?->getAttribute('commission') ?? 0) / 100;
      $pph = (float) ($guarantorRate?->getAttribute('pph') ?? 0) / 100;

      if ($isSamePeriod) {
        $guaranteeValue = (float) $newSubmission->getAttribute('guarantee_value');
        return $this->extractedCapitalRates($timePeriode, $guaranteeValue, null, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate);
      } else {
        $oldGuaranteeValue = (float) $oldSubmission->getAttribute('guarantee_value');
        $newGuaranteeValue = (float) $newSubmission->getAttribute('guarantee_value');
        return $this->extractedCapitalRates($timePeriode, $oldGuaranteeValue, $newGuaranteeValue, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate);
      }
    } else {
      $newSubmission = Submission::where('submission_before_id', $submission->id)->first();

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

      if ($newSubmission) {
        $oldDate = Carbon::parse($submission->getAttribute('send_to_guarantor_at'));
        $newDate = Carbon::parse($newSubmission->getAttribute('send_to_guarantor_at'));

        $oldPeriod = $this->getPeriod($oldDate);
        $newPeriod = $this->getPeriod($newDate);

        $isSamePeriod = $oldDate->month === $newDate->month
          && $oldDate->year === $newDate->year
          && $oldPeriod === $newPeriod;

        if ($isSamePeriod) {
          return $this->extractedCapitalRates($timePeriode, null, $guaranteeValue, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate);
        } else {
          return $this->extractedCapitalRates($timePeriode, $guaranteeValue, null, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate);
        }
      } else {
        return $this->extractedCapitalRates($timePeriode, $guaranteeValue, null, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate);
      }
    }
  }

  public function calculateOffice(Submission $submission): Collection
  {
    if ($submission->getAttribute('submission_before_id') !== null) {
      $newSubmission = null;
      $oldSubmission = null;

      $newSubmission = $submission;
      $oldSubmission = Submission::find($newSubmission->getAttribute('submission_before_id'));

      $oldDate = Carbon::parse($oldSubmission->getAttribute('send_to_guarantor_at'));
      $newDate = Carbon::parse($newSubmission->getAttribute('send_to_guarantor_at'));

      $oldPeriod = $this->getPeriod($oldDate);
      $newPeriod = $this->getPeriod($newDate);

      $isSamePeriod = $oldDate->month === $newDate->month
        && $oldDate->year === $newDate->year
        && $oldPeriod === $newPeriod;

      $newSubmission->loadMissing(['office.profileRate']);
      $office = $newSubmission->getRelation('office');
      $timePeriode = (int) $newSubmission->getAttribute('time_period');
      $profileRate = $office->getRelation('profileRate')
        ->where('guarantor_id', $newSubmission->getAttribute('guarantor_id'))
        ->where('guarantor_to_product_type_id', $newSubmission->getAttribute('guarantor_to_product_type_id'))
        ->first();

      $rate = (float) ($profileRate?->getAttribute('selling_rate') ?? 0);
      $adm = (float) ($profileRate?->getAttribute('sales_administration') ?? 0);
      $minimum = (float) ($profileRate?->getAttribute('minimum_bill') ?? 0);
      $brokenRate = (float) ($profileRate?->getAttribute('broken_rate') ?? 0);
      $revisedRate = (float) ($profileRate?->getAttribute('revised_rate') ?? 0);

      if ($isSamePeriod) {
        $guaranteeValue = (float) $newSubmission->getAttribute('guarantee_value');
        return $this->extractedSellingRates($guaranteeValue, null, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
      } else {
        $oldGuaranteeValue = (float) $oldSubmission->getAttribute('guarantee_value');
        $newGuaranteeValue = (float) $newSubmission->getAttribute('guarantee_value');
        return $this->extractedSellingRates($oldGuaranteeValue, $newGuaranteeValue, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
      }
    } else {
      $newSubmission = Submission::where('submission_before_id', $submission->id)->first();

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

      if ($newSubmission) {
        $oldDate = Carbon::parse($submission->getAttribute('send_to_guarantor_at'));
        $newDate = Carbon::parse($newSubmission->getAttribute('send_to_guarantor_at'));

        $oldPeriod = $this->getPeriod($oldDate);
        $newPeriod = $this->getPeriod($newDate);

        $isSamePeriod = $oldDate->month === $newDate->month
          && $oldDate->year === $newDate->year
          && $oldPeriod === $newPeriod;

        if ($isSamePeriod) {
          return $this->extractedSellingRates(null, $guaranteeValue, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
        } else {
          return $this->extractedSellingRates($guaranteeValue, null, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
        }
      } else {
        return $this->extractedSellingRates($guaranteeValue, null, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
      }
    }
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

    return $this->extractedSellingRates($guaranteeValue, null, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
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

    return $this->extractedCapitalRates($timePeriode, $guaranteeValue, null, $rate, $minimum, $adm, $commission, $pph, $brokenRate, $revisedRate);
  }

  public function calculateSellingRates(Submission $submission): Collection
  {
    $submission->loadMissing([
      // 'submissionRate',
      'office.profileRate',
    ]);
    // Ensure the submission is fresh to get the latest rates
    $isRevised = $submission->getAttribute('status') == SubmissionStatus::REVISED->value;
    $timePeriode = (int) $submission->getAttribute('time_period');
    $guaranteeValue = (float) $submission->getAttribute('guarantee_value');
    $settingRate =
      // $submission->getRelation('submissionRate') ??
      $submission->getRelation('office')?->getRelation('profileRate')
      ->where('guarantor_id', $submission->getAttribute('guarantor_id'))
      ->where('guarantor_to_product_type_id', $submission->getAttribute('guarantor_to_product_type_id'))
      ->first();
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

    return $this->extractedSellingRates($guaranteeValue, null, $rate, $timePeriode, $adm, $minimum, $brokenRate, $revisedRate);
  }

  private function extractedSellingRates(
    float|null $oldGuaranteeValue,
    float|null $newGuaranteeValue,
    float|int $rate,
    int $timePeriode,
    float $adm,
    float|int $minimum,
    float $brokenRate,
    float $revisedRate,
  ): Collection {
    if ($oldGuaranteeValue && $newGuaranteeValue) {
      $oldSubService = $oldGuaranteeValue * ($rate / 100);
      $newSubService = $newGuaranteeValue * ($rate / 100);

      $oldServiceCharges = $timePeriode > 90 ? ($oldSubService * $timePeriode) / 90 : $oldSubService;
      $newServiceCharges = $timePeriode > 90 ? ($newSubService * $timePeriode) / 90 : $newSubService;

      $oldTotal = max(($oldServiceCharges + $adm), $minimum);
      $newTotal = max(($newServiceCharges + $adm), $minimum);
      $total = ($newTotal - $oldTotal) + $brokenRate;

      $premi = max($newServiceCharges, $minimum);

      return collect([
        'minimum' => $minimum,
        'rate' => $rate,
        'adm' => $adm,
        'broken_rate' => $brokenRate,
        'revised_rate' => $revisedRate,
        'service_charges' => $newServiceCharges,
        'total' => $total,
        'premi' => $premi,
      ]);
    } else {
      $guarantee = $newGuaranteeValue && !$oldGuaranteeValue
        ? $newGuaranteeValue
        : ($oldGuaranteeValue && !$newGuaranteeValue ? $oldGuaranteeValue : 0);

      $subService = $guarantee * ($rate / 100);
      $serviceCharges = $timePeriode > 90 ? ($subService * $timePeriode) / 90 : $subService;

      $total = $newGuaranteeValue && !$oldGuaranteeValue
        ? $brokenRate
        : max(($serviceCharges + $adm), $minimum);

      $premi = max($serviceCharges, $minimum);

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
  }

  private function extractedCapitalRates(
    int $timePeriode,
    float|null $oldGuaranteeValue,
    float|null $newGuaranteeValue,
    float $rate,
    float|int $minimum,
    float|int $adm,
    float $commission,
    float $pph,
    float|int $brokenRate,
    float|int $revisedRate
  ): Collection {
    if ($oldGuaranteeValue && $newGuaranteeValue) {
      $oldServiceCharge = (float) $timePeriode > 91 ? (($oldGuaranteeValue * $rate * $timePeriode) / 91) : ($oldGuaranteeValue * $rate);
      $newServiceCharge = (float) $timePeriode > 91 ? (($newGuaranteeValue * $rate * $timePeriode) / 91) : ($newGuaranteeValue * $rate);

      $oldPremi = max($oldServiceCharge, $minimum);
      $newPremi = max($newServiceCharge, $minimum);
      $oldTotal = max(($adm + $oldServiceCharge), ($adm + $oldPremi));
      $newTotal = max(($adm + $newServiceCharge), ($adm + $newPremi));

      $premi = ($newPremi - $oldPremi) + $brokenRate;
      $total = ($newTotal - $oldTotal) + $brokenRate;

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
        'service_charges' => $newServiceCharge,
        'premi' => $premi,
        'total' => $total,
        'commission' => $commissionResult,
        'pph_commission' => $pphResult,
        'nett_commission' => $nettCommission,
        'nett_premi' => $nettPremi,
      ]);
    } else {
      $guarantee = $newGuaranteeValue && !$oldGuaranteeValue
        ? $newGuaranteeValue
        : ($oldGuaranteeValue && !$newGuaranteeValue ? $oldGuaranteeValue : 0);

      $serviceCharge = (float) $timePeriode > 91 ? (($guarantee * $rate * $timePeriode) / 91) : ($guarantee * $rate);
      $premi = $newGuaranteeValue && !$oldGuaranteeValue
        ? $brokenRate
        : max($serviceCharge, $minimum);
      $total = $newGuaranteeValue && !$oldGuaranteeValue
        ? $brokenRate
        : max(($adm + $serviceCharge), ($adm + $premi));
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

  private function getPeriod(Carbon $date): int
  {
    $day = (int) $date->day;

    if ($day >= 1 && $day <= 10) {
      return 1;
    } elseif ($day >= 11 && $day <= 20) {
      return 2;
    }
    return 3;
  }
}
