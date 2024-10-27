<?php

namespace App\Enums;

enum SubmissionStatus: string
{
    case PROCESS = 'process';

    case APPROVED = 'approved';

    case REJECTED = 'rejected';

    public static function getValues(): array
    {
        return [
            self::PROCESS,
            self::APPROVED,
            self::REJECTED,
        ];
    }
}
