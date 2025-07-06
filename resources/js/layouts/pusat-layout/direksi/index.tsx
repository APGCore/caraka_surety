import useFlashMessageToast from "@/common/hooks/general/use-flash-message";
import { SidebarInset, SidebarProvider } from "@/components/_shadcn-ui/sidebar";
import { Toaster } from "@/components/_shadcn-ui/toaster";
import Navbar from "@/components/organisms/navbar";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { direksiRoute } from "./direksi-layout.constant";
import { DireksiLayoutPageProps } from "./direksi-layout.type";

export const DireksiLayoutPage: DireksiLayoutPageProps = ({ children, user, roles, guarantor }) => {
  useFlashMessageToast();

  return (
    <SidebarProvider>
      <AppSidebar user={user} routes={direksiRoute} roles={roles} />
      <SidebarInset>
        <Navbar guarantor={guarantor} />
        <div className="flex flex-1 flex-col gap-4 p-4 pt-[84px] pb-[50px]  xl:max-w-7xl w-full mx-auto">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
};

export default DireksiLayoutPage;
