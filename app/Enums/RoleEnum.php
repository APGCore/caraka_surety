<?php

namespace App\Enums;

enum RoleEnum: string
{
    case Admin = 'Admin';
    case AdminRoute = 'admin.index';
    case Direksi = 'Direksi';
    case DireksiRoute = 'direksi.index';
    case KepalaCabang = 'Kepala Cabang';
    case KepalaCabangRoute = 'kepala-cabang.index';
    case Manager = 'Manager';
    case ManagerRoute = 'manager.index';
    case Staff = 'Staff';
    case StaffRoute = 'staff.index';
    case StaffTeknik = 'Staff Teknik';
    case StaffTeknikRoute = 'staff-teknik.index';
    case StaffOperasional = 'Staff Operasional';
    case StaffOperasionalRoute = 'staff-operasional.index';

    public static function getValues(): array
    {
        return [
            self::Admin->value,
            self::Direksi->value,
            self::KepalaCabang->value,
            self::Manager->value,
            self::Staff->value,
            self::StaffTeknik->value,
            self::StaffOperasional->value,
        ];
    }

    public static function getRoute(): array
    {
        return [
            self::Admin->value => self::AdminRoute->value,
            self::Direksi->value => self::DireksiRoute->value,
            self::KepalaCabang->value => self::KepalaCabangRoute->value,
            self::Manager->value => self::ManagerRoute->value,
            self::Staff->value => self::StaffRoute->value,
            self::StaffTeknik->value => self::StaffTeknikRoute->value,
            self::StaffOperasional->value => self::StaffOperasionalRoute->value,
        ];
    }
}
