<?php

namespace App\Enums;

enum RoleEnum: string
{
    case Admin = 'Admin';
    case Direksi = 'Direksi';
    case KepalaCabang = 'Kepala Cabang';
    case Manager = 'Manager';
    case Staff = 'Staff';

    public static function getValues(): array
    {
        return [
            self::Admin->value,
            self::Direksi->value,
            self::KepalaCabang->value,
            self::Manager->value,
            self::Staff->value,
        ];
    }
}
