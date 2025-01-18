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

    public static function getName(): array
    {
        return ['Kantor Pusat', 'Kantor Cabang', 'Mitra Agen', 'Mitra Pemasaran'];
    }

    public static function getNameOfValue(): array
    {
        return [
            self::HEADQUARTER->value => self::getName()[0],
            self::BRANCH->value => self::getName()[1],
            self::AGENT_PARTNER->value => self::getName()[2],
            self::MARKETING_PARTNER->value => self::getName()[3],
        ];
    }

    public static function getValueOfName(): array
    {
        return [
            self::getName()[0] => self::HEADQUARTER->value,
            self::getName()[1] => self::BRANCH->value,
            self::getName()[2] => self::AGENT_PARTNER->value,
            self::getName()[3] => self::MARKETING_PARTNER->value,
        ];
    }
}
