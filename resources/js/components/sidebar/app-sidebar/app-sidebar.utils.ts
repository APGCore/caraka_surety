import { Roles } from "@/common/types/roles";

export const displaySidebarMenuName = (role: string, roles: Roles) => {
  switch (role) {
    case roles.Admin:
      return "Admin";
    case roles.Direksi:
      return "Direksi";
    case roles.Manager:
      return "Manager";
    case roles.StaffOperasional:
      return "Staff Operasional";
    case roles.StaffTeknik:
      return "Staff Teknik";
    case roles.KepalaCabang:
      return "Kepala Cabang";
    case roles.KepalaAgentPartner:
      return "Kepala Mitra Agen";
    case roles.AgentPartner:
      return "Staff Mitra Agen";
    case roles.MarketingPartner:
      return "Staff Mitra Pemasaran";
    case roles.Staff:
      return "Staff";
    default:
      return "User";
  }
};
