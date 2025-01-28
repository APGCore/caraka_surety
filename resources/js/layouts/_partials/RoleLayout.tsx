import AdminLayoutPage from "../Admin";
import KepalaCabangLayoutPage from "../kepala-cabang";
import DireksiLayoutPage from "../Pusat/Direksi";
import ManagerLayoutPage from "../Pusat/Manager";
import StaffOperasionalLayoutPage from "../Pusat/StaffOperasional";
import StaffTeknikLayoutPage from "../Pusat/StaffTeknik";
import StaffLayoutPage from "../staff";
import StaffCabangLayoutPage from "../staff-cabang";

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
interface RoleLayout extends React.PropsWithChildren {
  roles: typeof Roles;
  user: any;
}

const RoleLayout: React.FC<RoleLayout> = ({ roles, user, children }) => {
  switch (user.role.name) {
    case roles.Admin:
      return <AdminLayoutPage user={user}>{children}</AdminLayoutPage>;
    case roles.Direksi:
      return <DireksiLayoutPage user={user}>{children}</DireksiLayoutPage>;
    case roles.Manager:
      return <ManagerLayoutPage user={user}>{children}</ManagerLayoutPage>;
    case roles.StaffTeknik:
      return <StaffTeknikLayoutPage user={user}>{children}</StaffTeknikLayoutPage>;
    case roles.StaffOperasional:
      return <StaffOperasionalLayoutPage user={user}>{children}</StaffOperasionalLayoutPage>;
    case roles.LeadCabang:
      return <KepalaCabangLayoutPage user={user}>{children}</KepalaCabangLayoutPage>;
    case roles.StaffCabang:
      return <StaffCabangLayoutPage user={user}>{children}</StaffCabangLayoutPage>;
    // case roles.LeadMarketingPartner:
    //   return <KepalaMitraPemasaranLayoutPage user={user}>{children}</KepalaMitraPemasaranLayoutPage>;
    // case roles.StaffMarketingPartner:
    //   return <StaffMitraAgenLayoutPage user={user}>{children}</StaffMitraAgenLayoutPage>;
    // case roles.StaffAgentPartner:
    //   return <StaffMitraAgenLayoutPage user={user}>{children}</StaffMitraAgenLayoutPage>;
    default:
      return <StaffLayoutPage user={user}>{children}</StaffLayoutPage>;
  }
};

export default RoleLayout;
