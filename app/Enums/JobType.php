<?php

namespace App\Enums;

enum JobType: string
{
    case CONDITIONAL = 'Conditional';
    case UNCONDITIONAL = 'Unconditional';

    public static function getValues(): array
    {
        return [
            self::CONDITIONAL->value,
            self::UNCONDITIONAL->value,
        ];
    }
}
