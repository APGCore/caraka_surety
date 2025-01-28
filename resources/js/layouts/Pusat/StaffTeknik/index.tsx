import Clock from "@/components/common/clock";
import AppSidebar from "@/components/organisms/SideBar/AppSideBar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import useFlashMessageToast from "@/hooks/general/use-flash-message";
import { staffTeknikRoute } from "./StaffTeknikLayout.constant";
import { StaffTeknikLayoutPageProps } from "./StaffTeknikLayout.type";

export const StaffTeknikLayoutPage: StaffTeknikLayoutPageProps = ({ children, user }) => {
  useFlashMessageToast();

  return (
    <SidebarProvider>
      <AppSidebar user={user} routes={staffTeknikRoute} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear  fixed z-20 top-0 group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%_-_48px)] md:w-[calc(100%_-_269px)] w-[calc(100%_-_0px)] bg-white border-b-[1px]">
          <div className="flex justify-between pr-4 w-full">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
            </div>
            <div>
              <Clock />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-[84px] pb-[50px]  xl:max-w-6xl w-full mx-auto">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
};

export default StaffTeknikLayoutPage;
