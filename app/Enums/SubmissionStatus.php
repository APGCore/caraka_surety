<?php

namespace App\Enums;

enum SubmissionStatus: string
{
    case PROCESS = 'process';

    case APPROVED = 'approved';

    case REJECTED = 'rejected';

    case BROKEN = 'broken';

    public static function getValues(): array
    {
        return [
            self::PROCESS->value,
            self::APPROVED->value,
            self::REJECTED->value,
            self::BROKEN->value,
        ];
    }
}
