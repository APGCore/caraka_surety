import AdminLayoutPage from "../admin-layout";
import AgentPartnerLayoutPage from "../agent-partner";
import KepalaCabangLayoutPage from "../cabang-layout/kepala-cabang";
import KepalaAgentPartnerLayoutPage from "../kepala-agent-partner";
import MarketingPartnerLayoutPage from "../marketing-partner";
import DireksiLayoutPage from "../pusat-layout/direksi";
import ManagerLayoutPage from "../pusat-layout/manager";
import StaffLayoutPage from "../pusat-layout/staff";
import StaffOperasionalLayoutPage from "../pusat-layout/staff-operasional";
import StaffTeknikLayoutPage from "../pusat-layout/staff-teknik";

interface IRoleBasedLayout extends React.PropsWithChildren {
  propsData?: any;
  [key: string]: unknown;
}

const RoleBasedLayout: React.FC<IRoleBasedLayout> = ({ propsData, children, ...props }) => {
  const { auth, roles, guarantor } = propsData;
  const user = auth?.user;
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
    case roles.StaffTeknik:
      return (
        <StaffTeknikLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </StaffTeknikLayoutPage>
      );
    case roles.StaffOperasional:
      return (
        <StaffOperasionalLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </StaffOperasionalLayoutPage>
      );
    case roles.KepalaCabang:
      return (
        <KepalaCabangLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </KepalaCabangLayoutPage>
      );
    case roles.KepalaAgentPartner:
      return (
        <KepalaAgentPartnerLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </KepalaAgentPartnerLayoutPage>
      );
    case roles.AgentPartner:
      return (
        <AgentPartnerLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </AgentPartnerLayoutPage>
      );
    case roles.MarketingPartner:
      return (
        <MarketingPartnerLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </MarketingPartnerLayoutPage>
      );
    // case roles.StaffCabang:
    //   return (
    //     <StaffCabangLayoutPage user={user} {...props}>
    //       {children}
    //     </StaffCabangLayoutPage>
    //   );
    default:
      return (
        <StaffLayoutPage user={user} roles={roles} guarantor={guarantor} {...props}>
          {children}
        </StaffLayoutPage>
      );
  }
};

export default RoleBasedLayout;
