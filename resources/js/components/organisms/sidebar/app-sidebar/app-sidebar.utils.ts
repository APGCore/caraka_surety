export enum Roles {
  Admin = "Admin",
  Direksi = "Direksi",
  Manager = "Manager",
  StaffOperasional = "Staff Operasional",
  StaffTeknik = "Staff Teknik",
  LeadCabang = "Kepala Cabang",
  StaffCabang = "Staff Cabang",
  LeadMarketingPartner = "Kepala Mitra Pemasaran",
  StaffMarketingPartner = "Staff Mitra Pemasaran",
  StaffAgentPartner = "Staff Mitra Agen",
  Staff = "Staff",
}

export const displaySidebarMenuName = (role: string) => {
  switch (role) {
    case Roles.Admin:
      return "Admin";
    case Roles.Direksi:
      return "Direksi";
    case Roles.Manager:
      return "Manager";
    case Roles.StaffOperasional:
      return "Staff Operasional";
    case Roles.StaffTeknik:
      return "Staff Teknik";
    case Roles.LeadCabang:
      return "Kepala Cabang";
    case Roles.StaffCabang:
      return "Staff Cabang";
    case Roles.LeadMarketingPartner:
      return "Kepala Mitra Pemasaran";
    case Roles.StaffMarketingPartner:
      return "Staff Mitra Pemasaran";
    case Roles.StaffAgentPartner:
      return "Staff Mitra Agen";
    case Roles.Staff:
      return "Staff";
    default:
      return "User";
  }
};
