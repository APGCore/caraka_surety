import useFlashMessageToast from "@/common/hooks/general/use-flash-message";
import { SidebarInset, SidebarProvider } from "@/components/_shadcn-ui/sidebar";
import { Toaster } from "@/components/_shadcn-ui/toaster";
import Navbar from "@/components/organisms/navbar";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { staffTeknikRoute } from "./staff-teknik-layout.constant";
import { StaffTeknikLayoutPageProps } from "./staff-teknik-layout.type";

export const StaffTeknikLayoutPage: StaffTeknikLayoutPageProps = ({ children, user, roles }) => {
  useFlashMessageToast();

  return (
    <SidebarProvider>
      <AppSidebar user={user} routes={staffTeknikRoute} roles={roles} />
      <SidebarInset>
        <Navbar />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-[84px] pb-[50px]  xl:max-w-6xl w-full mx-auto">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
};

export default StaffTeknikLayoutPage;
