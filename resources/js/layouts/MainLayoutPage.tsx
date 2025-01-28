import AdminLayoutPage from "@/layouts/Admin";
import DireksiLayoutPage from "@/layouts/direksi";
import KepalaCabangLayoutPage from "@/layouts/kepala-cabang";
import ManagerLayoutPage from "@/layouts/manager";
import StaffLayoutPage from "@/layouts/staff";
import React from "react";

export enum Roles {
  Admin = "Admin",
  Direksi = "Direksi",
  KepalaCabang = "Kepala Cabang",
  Manager = "Manager",
  AgentPartner = "Mitra Agen",
  MarketingPartner = "Mitra Pemasaran",
  Staff = "Staff",
  StaffTeknik = "Staff Teknik",
  StaffOperasional = "Staff Operasional",
}
interface MainLayoutPage extends React.PropsWithChildren {
  roles: typeof Roles;
  user: any;
}

const MainLayoutPage: React.FC<MainLayoutPage> = ({ roles, user, children }) => {
  switch (user.role.name) {
    case roles.Admin:
      return <AdminLayoutPage user={user}>{children}</AdminLayoutPage>;
    case roles.Direksi:
      return <DireksiLayoutPage user={user}>{children}</DireksiLayoutPage>;
    case roles.KepalaCabang:
      return <KepalaCabangLayoutPage user={user}>{children}</KepalaCabangLayoutPage>;
    case roles.Manager:
      return <ManagerLayoutPage user={user}>{children}</ManagerLayoutPage>;
    case roles.AgentPartner:
      return <StaffLayoutPage user={user}>{children}</StaffLayoutPage>;
    case roles.MarketingPartner:
      return <StaffLayoutPage user={user}>{children}</StaffLayoutPage>;
    case roles.StaffTeknik:
      return <StaffLayoutPage user={user}>{children}</StaffLayoutPage>;
    case roles.StaffOperasional:
      return <StaffLayoutPage user={user}>{children}</StaffLayoutPage>;
    default:
      return <StaffLayoutPage user={user}>{children}</StaffLayoutPage>;
  }
};

export default MainLayoutPage;
