import Clock from "@/components/common/clock";
import RenderList from "@/components/common/render-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import useFlashMessageToast from "@/hooks/use-flash-message";
import { Link } from "@inertiajs/react";
import { ChevronRight, ChevronsUpDown, GalleryVerticalEnd, LogOut, UserRound } from "lucide-react";
import { kepalaCabangRoute } from "./kepala-cabang-layout.constant";
import { KepalaCabangLayoutPageProps } from "./kepala-cabang-layout.type";

export const KepalaCabangLayoutPage: KepalaCabangLayoutPageProps = ({ children, user }) => {
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
                  <span className="truncate font-semibold">BPR Bonding</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <RenderList
                of={kepalaCabangRoute.navMain}
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
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={user?.picture || ""} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{user?.name}</span>
                      <span className="truncate text-xs">{user?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}>
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.picture || ""} alt={user?.name} />
                        <AvatarFallback className="rounded-lg">
                          {user.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{user?.name}</span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem className="space-x-2">
                      <UserRound />
                      <Link href={route("profile.edit")} as="button" className="flex-1 text-start">
                        Profile
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="space-x-2 bg-red-500 text-white">
                    <LogOut />
                    <Link href={route("logout")} method="post" as="button" className="flex-1 text-start">
                      Log Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
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

export default KepalaCabangLayoutPage;
