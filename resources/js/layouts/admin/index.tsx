import Clock from "@/components/common/clock";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/toaster";
import useFlashMessageToast from "@/hooks/use-flash-message";
import { cn } from "@/lib/cn";
import { Link } from "@inertiajs/react";
import { CircleUser, Home, LineChart, Menu, Package, Package2, ShoppingCart, Users } from "lucide-react";
import { adminLinks } from "./admin-layout.constant";
import { AdminLayoutProps } from "./admin-layout.type";

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, user }) => {
  useFlashMessageToast();

  return (
    <div className="grid h-screen w-full md:grid-cols-[250px_1fr] md:overflow-hidden">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Acme Inc</span>
            </Link>
          </div>
          <div className="flex-1 pb-10 overflow-y-auto">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 space-y-3">
              {adminLinks.map((admin, index) => {
                if (admin.title !== "Dashboard") {
                  return (
                    <div key={index + 1}>
                      <p className="pl-3 font-bold pb-1.5">{admin.title}</p>
                      {admin.route.map((r) => {
                        const isActiveRoute = route().current(r.route_name);
                        const Icon = r.Icon;
                        return (
                          <Link
                            key={r.id}
                            href={r.href}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:text-white hover:bg-black",
                              {
                                "bg-black text-white": isActiveRoute,
                              },
                            )}>
                            <Icon className="h-4 w-4" />
                            {r.name}
                          </Link>
                        );
                      })}
                    </div>
                  );
                }

                return admin.route.map((r) => {
                  const isActiveRoute = route().current(r.route_name);
                  const Icon = r.Icon;

                  return (
                    <Link
                      key={r.id}
                      href={r.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:text-white hover:bg-black",
                        {
                          "bg-black text-white": isActiveRoute,
                        },
                      )}>
                      <Icon className="h-4 w-4" />
                      {r.name}
                    </Link>
                  );
                });
              })}
            </nav>
          </div>
        </div>
      </div>
      <div className="flex-grow md:overflow-y-auto">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 fixed top-0 md:w-[calc(100%_-_240px)] w-full flex-grow bg-white z-10">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground">
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">6</Badge>
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <Users className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground">
                  <LineChart className="h-5 w-5" />
                  Analytics
                </Link>
              </nav>
              <div className="mt-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Upgrade to Pro</CardTitle>
                    <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button size="sm" className="w-full">
                      Upgrade
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <Clock />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-x-3">
                <Button variant="secondary" size="icon" className="rounded-full">
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
                <span className="font-bold text-sm">{user?.name?.slice(0, 7)}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={route("profile.edit")} as="button">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={route("logout")} method="post" as="button">
                  Log Out
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 lg:pt-[80px] flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminLayout;
