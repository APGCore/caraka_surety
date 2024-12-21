<?php

namespace App\Enums;

enum OfficeType: string
{
    case HEADQUARTER = 'headquarter';
    case BRANCH = 'branch';
    case AGENT_PARTNER = 'agent_partner';
    case MARKETING_PARTNER = 'marketing_partner';

    public static function getValues(): array
    {
        return [
            self::HEADQUARTER->value,
            self::BRANCH->value,
            self::AGENT_PARTNER->value,
            self::MARKETING_PARTNER->value,
        ];
    }
}
