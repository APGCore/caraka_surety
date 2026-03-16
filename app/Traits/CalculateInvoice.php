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
            $serviceCharges *= -1;
            $total *= -1;
        }

        //        dd(collect([
        //          'minimum' => $minimum,
        //          'rate' => $rate,
        //          'adm' => $adm,
        //          'broken_rate' => $brokenRate,
        //          'revised_rate' => $revisedRate,
        //          'service_charges' => $serviceCharges,
        //          'total' => $total,
        //          'premi' => $premi,
        //        ]));

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
            $serviceCharges *= -1;
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
     * Memetakan daftar submission menjadi collection untuk laporan produksi.
     *
     * Setiap submission diproses berdasarkan kondisi revisi:
     *
     * 1. Submission biasa (tidak ada revisi):
     *    - Dihitung langsung dengan rate sesuai status-nya.
     *
     * 2. Submission yang sudah direvisi oleh submission lain ($submissionAfter ada):
     *    - Status di-override ke APPROVED agar rate dihitung dengan tarif penuh,
     *      bukan tarif revisi.
     *
     * 3. Submission hasil revisi ($submissionBefore ada):
     *    - Menghasilkan 3 baris di laporan:
     *      a. Submission baru (current) — status APPROVED, nilai positif (rate penuh baru).
     *      b. Clone submission lama — status APPROVED, nilai MINUS (menganulir tagihan lama).
     *      c. Clone submission lama — status REVISED, nilai positif (biaya revisi saja).
     *    - Berlaku untuk dua skenario:
     *      - Beda periode: submission lama tidak muncul di list, sehingga baris (b)
     *        murni mengurangi akumulasi laporan.
     *      - Sama periode: submission lama muncul di list sebagai baris positif,
     *        sehingga baris (b) saling cancel dengan baris lama tersebut.
     *
     * Rate di-preload sebelum loop dengan menyertakan data dari semua submissionBefore
     * (guarantorId, officeId, productTypeId, tanggal kirim) agar rate dari periode
     * berbeda tetap ditemukan.
     *
     * @throws Exception
     */
    private function mapProductionReport($submissions): Collection
    {
        $result = collect();
        $submissions = collect($submissions);
        if ($submissions->isNotEmpty()) {
            // Kumpulkan submissionBefore dari semua submission agar rate periode lama ikut di-preload
            $submissionsBefore = $submissions->map(fn ($s) => $s->submissionBefore)->filter();

            $guarantorIds = $submissions->pluck('guarantor_id')
                ->merge($submissionsBefore->pluck('guarantor_id'))
                ->unique()->toArray();
            $guarantorToProductTypeIds = $submissions->pluck('guarantor_to_product_type_id')
                ->merge($submissionsBefore->pluck('guarantor_to_product_type_id'))
                ->unique()->toArray();
            $officeIds = $submissions->pluck('office_id')
                ->merge($submissionsBefore->pluck('office_id'))
                ->unique()->toArray();
            $hasSendToGuarantorAts = $submissions->pluck('send_to_guarantor_at')
                ->merge($submissionsBefore->pluck('send_to_guarantor_at'))
                ->filter()->unique()->toArray();

            $guarantorRates = $this->getGuarantorRates($guarantorIds, $guarantorToProductTypeIds, $hasSendToGuarantorAts);
            $officeRates = $this->getProfileRates($officeIds, $guarantorIds, $guarantorToProductTypeIds, $hasSendToGuarantorAts);
            foreach ($submissions as $submission) {
                $submissionBefore = $submission->submissionBefore;
                $submissionAfter = $submission->submissionAfter;

                // Jika submission ini sudah direvisi, paksa status APPROVED
                // agar rate dihitung dengan tarif penuh (bukan tarif revisi)
                if ($submissionAfter) {
                    $submission->status = SubmissionStatus::APPROVED->value;
                }

                if ($submissionBefore) {
                    // Baris (b): clone submission lama untuk di-negate (menganulir tagihan lama)
                    $submissionRevisedMinus = clone $submissionBefore;
                    // Baris (c): clone submission lama dengan status REVISED untuk biaya revisi
                    $submissionRevisedAdd = clone $submissionBefore;

                    // Submission baru (current) dihitung dengan rate penuh
                    $submission->status = SubmissionStatus::APPROVED->value;
                    // Rate penuh lama (akan di-negate)
                    $submissionRevisedMinus->status = SubmissionStatus::APPROVED->value;
                    // Biaya revisi saja (tarif revised)
                    $submissionRevisedAdd->status = SubmissionStatus::REVISED->value;

                    // Flag is_add & is_minus harus di-set setelah status di-assign
                    $submissionRevisedMinus->is_add = true;
                    $submissionRevisedMinus->is_minus = true;

                    // Baris (a): submission baru dengan rate penuh
                    $this->setRateSubmission($submission, $guarantorRates, $officeRates, $result);
                    // Baris (b): submission lama di-negate ($isMinus = true)
                    $this->setRateSubmission($submissionRevisedMinus, $guarantorRates, $officeRates, $result, true);
                    // Baris (c): submission lama dengan biaya revisi
                    $this->setRateSubmission($submissionRevisedAdd, $guarantorRates, $officeRates, $result);
                } else {
                    $this->setRateSubmission($submission, $guarantorRates, $officeRates, $result);
                }
            }
        }

        return $result;
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
