import useFlashMessageToast from "@/common/hooks/general/use-flash-message";
import { SidebarInset, SidebarProvider } from "@/components/_shadcn-ui/sidebar";
import { Toaster } from "@/components/_shadcn-ui/toaster";
import Navbar from "@/components/organisms/navbar";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { managerRoute } from "./manager-layout.constant";
import { ManagerLayoutPageProps } from "./manager-layout.type";

export const ManagerLayoutPage: ManagerLayoutPageProps = ({ children, user, roles }) => {
  useFlashMessageToast();

  return (
    <SidebarProvider>
      <AppSidebar user={user} routes={managerRoute} roles={roles} />
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

export default ManagerLayoutPage;
