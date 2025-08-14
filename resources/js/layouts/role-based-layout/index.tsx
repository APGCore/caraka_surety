import { Roles } from "@/common/types/roles";
import StaffCabangLayoutPage from "@/layouts/cabang-layout/staff-cabang";
import KeuanganLayoutPage from "@/layouts/pusat-layout/keuangan";
import { User } from "@/types";
import { OfficeTypeEnum } from "@/types/office-type-enum";
import AdminLayoutPage from "../admin-layout";
import KepalaCabangLayoutPage from "../cabang-layout/kepala-cabang";
import DireksiLayoutPage from "../pusat-layout/direksi";
import ManagerLayoutPage from "../pusat-layout/manager";
import StaffLayoutPage from "../pusat-layout/staff";

interface IRoleBasedLayout extends React.PropsWithChildren {
  propsData?: any;

  [key: string]: unknown;
}

const RoleBasedLayout: React.FC<IRoleBasedLayout> = ({ propsData, children, ...props }) => {
  const { auth, roles_names, guarantor } = propsData;
  const user: User = auth?.user;
  const roles: Roles = roles_names;
  const isHeadquarter = user.office.office_type === OfficeTypeEnum.HEADQUARTER;

  switch (user.role.name) {
    case roles.Admin:
      return (
        <AdminLayoutPage user={user} roles={roles} {...props}>
          {children}
        </AdminLayoutPage>
      );
    case roles.Direksi:
      return (
        <DireksiLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </DireksiLayoutPage>
      );
    case roles.Manager:
      return (
        <ManagerLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </ManagerLayoutPage>
      );
    case !isHeadquarter && roles.KepalaCabang:
      return (
        <KepalaCabangLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </KepalaCabangLayoutPage>
      );
    case roles.Keuangan:
      return (
        <KeuanganLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </KeuanganLayoutPage>
      );
    default:
      if (isHeadquarter) {
        return (
          <StaffLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
            {children}
          </StaffLayoutPage>
        );
      } else {
        return (
          <StaffCabangLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
            {children}
          </StaffCabangLayoutPage>
        );
      }
  }
};

export default RoleBasedLayout;
