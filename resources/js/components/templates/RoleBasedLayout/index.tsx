import AdminLayoutPage from "../AdminLayout";
import KepalaCabangLayoutPage from "../CabangLayout/KepalaCabang";
import StaffCabangLayoutPage from "../CabangLayout/StaffCabang";
import DireksiLayoutPage from "../PusatLayout/Direksi";
import ManagerLayoutPage from "../PusatLayout/Manager";
import StaffLayoutPage from "../PusatLayout/Staff";
import StaffOperasionalLayoutPage from "../PusatLayout/StaffOperasional";
import StaffTeknikLayoutPage from "../PusatLayout/StaffTeknik";

export enum Roles {
  Admin = "Admin",
  Direksi = "Direksi",
  Manager = "Manager",
  StaffOperasional = "Staff Operasional",
  StaffTeknik = "Staff Teknik",
  KepalaCabang = "Kepala Cabang",
  StaffCabang = "Staff Cabang",
  KepalaMitraPemasaran = "Kepala Mitra Pemasaran",
  StaffMitraPemasaran = "Staff Mitra Pemasaran",
  StaffMitraAgen = "Staff Mitra Agen",
  Staff = "Staff",
}

interface IRoleBasedLayout extends React.PropsWithChildren {
  user: any;
  [key: string]: unknown;
}

const RoleBasedLayout: React.FC<IRoleBasedLayout> = ({ user, children, ...props }) => {
  switch (user.role.name) {
    case Roles.Admin:
      return (
        <AdminLayoutPage user={user} {...props}>
          {children}
        </AdminLayoutPage>
      );
    case Roles.Direksi:
      return (
        <DireksiLayoutPage user={user} {...props}>
          {children}
        </DireksiLayoutPage>
      );
    case Roles.Manager:
      return (
        <ManagerLayoutPage user={user} {...props}>
          {children}
        </ManagerLayoutPage>
      );
    case Roles.StaffTeknik:
      return (
        <StaffTeknikLayoutPage user={user} {...props}>
          {children}
        </StaffTeknikLayoutPage>
      );
    case Roles.StaffOperasional:
      return (
        <StaffOperasionalLayoutPage user={user} {...props}>
          {children}
        </StaffOperasionalLayoutPage>
      );
    case Roles.KepalaCabang:
      return (
        <KepalaCabangLayoutPage user={user} {...props}>
          {children}
        </KepalaCabangLayoutPage>
      );
    case Roles.StaffCabang:
      return (
        <StaffCabangLayoutPage user={user} {...props}>
          {children}
        </StaffCabangLayoutPage>
      );
    // case roles.KepalaMitraPemasaran:
    //   return <KepalaMitraPemasaranLayoutPage user={user}>{children}</KepalaMitraPemasaranLayoutPage>;
    // case roles.StaffMitraPemasaran:
    //   return <StaffMitraAgenLayoutPage user={user}>{children}</StaffMitraAgenLayoutPage>;
    // case roles.StaffMitraAgen:
    //   return <StaffMitraAgenLayoutPage user={user}>{children}</StaffMitraAgenLayoutPage>;
    default:
      return (
        <StaffLayoutPage user={user} {...props}>
          {children}
        </StaffLayoutPage>
      );
  }
};

export default RoleBasedLayout;
