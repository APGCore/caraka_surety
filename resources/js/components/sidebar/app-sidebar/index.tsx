import { cn } from "@/common/utils/cn";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/_shadcn-ui/collapsible";
import useSidebar, {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/_shadcn-ui/sidebar";
import RenderList from "@/components/atoms/render-list";
import { SidebarMenuCustom } from "@/components/sidebar/app-sidebar/sidebar-menu-custom";
import { Link } from "@inertiajs/react";
import { ChevronRight, GalleryVerticalEnd } from "lucide-react";
import React from "react";
import { IAppSideBarProps } from "./app-sidebar.type";
import { displaySidebarMenuName } from "./app-sidebar.utils";

const AppSidebar: React.FC<IAppSideBarProps> = ({ user, routes, roles }) => {
  const { state } = useSidebar();

  return (
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
                <span className="truncate text-xs">{displaySidebarMenuName(user?.role?.name, roles)}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <RenderList
              of={routes}
              render={(item) => {
                const hasActiveSubItem = item?.items?.some((subItem) => route().current(`${subItem.route_name}.*`));
                return (
                  <Collapsible key={item.title} asChild defaultOpen={hasActiveSubItem} className="group/collapsible">
                    {item?.items && item?.items?.length > 0 ? (
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className={cn({
                              "group-data-[state=open]/collapsible:bg-black group-data-[state=open]/collapsible:text-white":
                                hasActiveSubItem && state === "collapsed",
                            })}>
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
  );
};

export default AppSidebar;
