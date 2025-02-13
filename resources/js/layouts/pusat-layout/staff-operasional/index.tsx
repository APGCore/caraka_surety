import useFlashMessageToast from "@/common/hooks/general/use-flash-message";
import { Separator } from "@/components/_shadcn-ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/_shadcn-ui/sidebar";
import { Toaster } from "@/components/_shadcn-ui/toaster";
import Clock from "@/components/atoms/clock";
import AppSidebar from "@/components/sidebar/app-sidebar";
import { staffOperasionalRoute } from "./staff-operasional-layout.constant";
import { StaffOperasionalLayoutPageProps } from "./staff-operasional-layout.type";

export const StaffOperasionalLayoutPage: StaffOperasionalLayoutPageProps = ({ children, user, roles }) => {
  useFlashMessageToast();

  return (
    <SidebarProvider>
      <AppSidebar user={user} routes={staffOperasionalRoute} roles={roles} />
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

export default StaffOperasionalLayoutPage;
