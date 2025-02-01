<?php

namespace App\Traits;

use App\Models\Guarantor\Blank;
use App\Models\Guarantor\Guarantor;
use App\Models\Guarantor\GuarantorToProductType;
use App\Models\Profile\Profile;
use App\Models\Sequence;

trait GeneratePattern
{
    /**
     * Upload file to the storage.
     */
    public function generateNoGuarantee(
        ?Guarantor $guarantor = null,
        ?GuarantorToProductType $guarantorToProductType = null,
        $guarantorBranchId = null,
        ?Blank $blank = null,
        ?Profile $profile = null
    ): string {
        $guarantor?->load(['branch', 'pattern']);
        $guarantorId = $guarantor?->getAttribute('id');
        $ka = $guarantor?->getAttribute('code') ?? '';
        $kc = $guarantor?->branch->where('id', $guarantorBranchId)->first()?->code ?? '';
        $kp = $guarantorToProductType?->getAttribute('code_product') ?? '';
        $kb = $blank?->getAttribute('number') ?? '';
        $noa = $profile?->getAttribute('code') ?? '';

        $guarantorPattern = $guarantor?->pattern;
        $pattern = $guarantorPattern?->prefix.$guarantorPattern?->content.$guarantorPattern?->suffix;
        $sequence = Sequence::query()->where('guarantor_id', $guarantorId)->orderByDesc('current')->get();
        $seqNodLast = $sequence->where('name', 'NOD')->first();
        $seqNomLast = $sequence->where('name', 'NOM')->first();
        $seqNoyLast = $sequence->where('name', 'NOY')->first();
        $nod = (string) $seqNodLast ? $seqNodLast->current + 1 : 1;
        $nom = (string) $seqNomLast ? $seqNomLast->current + 1 : 1;
        $noy = (string) $seqNoyLast ? $seqNoyLast->current + 1 : 1;
        $convertNoGuarantee = convertPattern($pattern, $ka, $kc, $noa, $kp, $kb, $nod, $nom, $noy);
        $value = $convertNoGuarantee['value'];
        $lengthNOD = $convertNoGuarantee['lengthNOD'];
        $lengthNOM = $convertNoGuarantee['lengthNOM'];
        $lengthNOY = $convertNoGuarantee['lengthNOY'];

        // create sequence
        if (str_contains($pattern, 'NOD')) {
            self::createSequence('NOD', $nod, $pattern, $guarantorId, $lengthNOD);
        }
        if (str_contains($pattern, 'NOM')) {
            self::createSequence('NOM', $nom, $pattern, $guarantorId, $lengthNOM);
        }
        if (str_contains($pattern, 'NOY')) {
            self::createSequence('NOY', $noy, $pattern, $guarantorId, $lengthNOY);
        }

        return $value;
    }

    private function createSequence($name, $current, $pattern, $guarantorId, $length): void
    {
        if (str_contains($pattern, $name)) {
            Sequence::query()->updateOrCreate([
                'name' => $name,
                'guarantor_id' => $guarantorId,
            ], [
                'current' => $current,
                'length' => $length,
            ]);
        }
    }
}
