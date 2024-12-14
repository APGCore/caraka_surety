import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { User } from "@/types";
import { Link } from "@inertiajs/react";
import { ChevronsUpDown, LogOut, UserRound } from "lucide-react";

export const SidebarMenuCustom: React.FC<{ user: User }> = ({ user }) => {
  return (
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
                <span className="truncate text-xs underline underline-offset-2">{user?.username}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}>
            <DropdownMenuGroup>
              <DropdownMenuItem className="space-x-2">
                <UserRound />
                <Link href={route("profile.edit")} as="button" className="flex-1 text-start">
                  Profile
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="space-x-2 bg-red-500 hover:bg-red-400/20 text-white">
              <LogOut />
              <Link href={route("logout")} method="post" as="button" className="flex-1 text-start">
                Log Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
