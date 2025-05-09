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

    case KepalaAgentPartner = 'Kepala Mitra Agen';

    case KepalaAgentPartnerRoute = 'kepala-agent-partner.index';

    case AgentPartner = 'Mitra Agen';
    case AgentPartnerRoute = 'agent-partner.index';

    case MarketingPartner = 'Mitra Pemasaran';
    case MarketingPartnerRoute = 'marketing-partner.index';

    case Staff = 'Staff';
    case StaffRoute = 'staff.index';
    case StaffTeknik = 'Staff Teknik';
    case StaffTeknikRoute = 'staff-teknik.index';
    case StaffOperasional = 'Staff Operasional';
    case StaffOperasionalRoute = 'staff-operasional.dashboard.index';

    case Finance = 'Keuangan';
    case FinanceRoute = 'keuangan.index';

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
            self::AgentPartner->value,
            self::MarketingPartner->value,
            self::KepalaAgentPartner->value,
            self::Finance->value,
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
            self::KepalaAgentPartner->value => self::KepalaAgentPartnerRoute->value,
            self::AgentPartner->value => self::AgentPartnerRoute->value,
            self::MarketingPartner->value => self::MarketingPartnerRoute->value,
            self::Finance->value => self::FinanceRoute->value,
        ];
    }

    public static function getKeyValue(): array
    {
        return [
            self::Admin->name => self::Admin->value,
            self::Direksi->name => self::Direksi->value,
            self::KepalaCabang->name => self::KepalaCabang->value,
            self::Manager->name => self::Manager->value,
            self::Staff->name => self::Staff->value,
            self::StaffTeknik->name => self::StaffTeknik->value,
            self::StaffOperasional->name => self::StaffOperasional->value,
            self::KepalaAgentPartner->name => self::KepalaAgentPartner->value,
            self::AgentPartner->name => self::AgentPartner->value,
            self::MarketingPartner->name => self::MarketingPartner->value,
            self::Finance->name => self::Finance->value,
        ];
    }
}
