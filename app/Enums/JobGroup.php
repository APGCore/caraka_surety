<?php

namespace App\Enums;

enum JobGroup: string
{
    case KONTRUKSI = 'Konstruksi';
    case NONKONTRUKSI = 'Non Konstruksi';

    public static function getValues(): array
    {
        return [
            self::KONTRUKSI->value,
            self::NONKONTRUKSI->value,
        ];
    }
}
