import Clock from "@/components/common/clock";
import RenderList from "@/components/common/render-list";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import useFlashMessageToast from "@/hooks/general/use-flash-message";
import { SidebarMenuCustom } from "@/layouts/_partials/sidebar-menu-custom";
import { Link } from "@inertiajs/react";
import { ChevronRight, GalleryVerticalEnd } from "lucide-react";
import { staffCabangRoute } from "./staff-cabang-layout.constant";
import { StaffCabangLayoutPageProps } from "./staff-cabang-layout.type";

export const StaffCabangLayoutPage: StaffCabangLayoutPageProps = ({ children, user }) => {
  useFlashMessageToast();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">APG - Core System</span>
                  <span className="truncate text-xs">Role Staff Cabang</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <RenderList
                of={staffCabangRoute.navMain}
                render={(item) => {
                  const hasActiveSubItem = item?.items.some((subItem) => route().current(`${subItem.route_name}.*`));
                  return (
                    <Collapsible key={item.title} asChild defaultOpen={hasActiveSubItem} className="group/collapsible">
                      {item.items.length > 0 ? (
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <item.icon />}
                              <span>{item.title}</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              <RenderList
                                of={item.items}
                                render={(subItem) => (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton asChild isActive={route().current(`${subItem.route_name}.*`)}>
                                      <Link href={subItem.href}>
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                )}
                              />
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      ) : (
                        <SidebarMenuItem>
                          <SidebarMenuButton
                            tooltip={item.title}
                            isActive={item.route_name ? route().current(`${item.route_name}.*`) : false}>
                            {item.icon && <item.icon />}
                            <Link href={item?.href ?? "#"} className="w-full">
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </Collapsible>
                  );
                }}
              />
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenuCustom user={user} />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear  fixed z-20 top-0 group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%_-_48px)] md:w-[calc(100%_-_255px)] w-[calc(100%_-_0px)] bg-white border-b-[1px]">
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
        <div className="flex flex-1 flex-col gap-4 p-4 pt-[84px] pb-[50px]">{children}</div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
};

export default StaffCabangLayoutPage;
