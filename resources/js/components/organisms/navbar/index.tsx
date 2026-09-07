import Show from "@/_features/_common/components/show";
import { Separator } from "@/components/_shadcn-ui/separator";
import { SidebarTrigger } from "@/components/_shadcn-ui/sidebar";
import Clock from "@/components/atoms/clock";
import React from "react";

interface NavbarProps {
  office?: any;
}

const Navbar: React.FC<NavbarProps> = ({ office }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear  fixed z-20 top-0 group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%_-_48px)] md:w-[calc(100%_-_269px)] w-[calc(100%_-_0px)] bg-white border-b-[1px]">
      <div className="flex items-center justify-between pr-4 w-full">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-6" />
        </div>
        <div className="flex items-center justify-between w-auto">
          <img src="/logo-caraka.webp" alt="Caraka Mulia" className="flex-shrink-0 max-h-[50px] w-auto" />
          <Show when={office}>
            <Separator orientation="vertical" className="mr-2 w-[2px] h-10" />
            {office?.name}
          </Show>
        </div>
        <div>
          <Clock />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
