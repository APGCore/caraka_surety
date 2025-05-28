<?php

namespace App\Traits;

use Carbon\Carbon;

trait Numbering
{
    public function generateNomorSurat($submission): string
    {
        $submissionId = $submission->id;
        $guarantorCode = $submission->guarantor->code;
        $createdAt = Carbon::parse($submission->created_at)->format('Y'); // Format tanggal Y

        return strtoupper("{$guarantorCode}/{$submissionId}/{$createdAt}");
    }

    public function generateNomorSuratResume($id, $createdAt): string
    {
        return "{$id}/BPR/".Carbon::parse($createdAt)->format('m/Y');
    }
}
