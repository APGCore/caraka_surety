<?php

namespace App\Enums;

enum SubmissionStatus: string
{
    case PROCESS = 'process';

    case APPROVED = 'approved';

    case REJECTED = 'rejected';

    case REVISED = 'revised';

    case BROKEN = 'broken';

    public static function getValues(): array
    {
        return [
            self::PROCESS->value,
            self::APPROVED->value,
            self::REJECTED->value,
            self::REVISED->value,
            self::BROKEN->value,
        ];
    }

    public static function getLabels(): array
    {
        return [
            self::PROCESS->value => 'Proses',
            self::APPROVED->value => 'Disetujui',
            self::REJECTED->value => 'Ditolak',
            self::REVISED->value => 'Direvisi',
            self::BROKEN->value => 'Rusak',
        ];
    }
}
