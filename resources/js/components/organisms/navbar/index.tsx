import { Separator } from "@/components/_shadcn-ui/separator";
import { SidebarTrigger } from "@/components/_shadcn-ui/sidebar";
import Clock from "@/components/atoms/clock";
import React from "react";

interface NavbarProps {
  guarantor?: any;
}

const Navbar: React.FC<NavbarProps> = ({ guarantor }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear  fixed z-20 top-0 group-has-[[data-collapsible=icon]]/sidebar-wrapper:w-[calc(100%_-_48px)] md:w-[calc(100%_-_269px)] w-[calc(100%_-_0px)] bg-white border-b-[1px]">
      <div className="flex items-center justify-between pr-4 w-full">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        <div className="flex items-center justify-between w-auto">
          <img src="/bpr-bonding.png" alt="" className="flex-shrink-0 max-h-[50px] w-auto" />
          {guarantor && (
            <>
              <h1 className="text-1xl font-bold">X</h1>
              {guarantor.picture ? (
                <img src={"/storage/" + guarantor.picture} alt="" className="flex-shrink-0 max-h-[40px] w-auto" />
              ) : (
                <h1 className="text-1xl font-bold">{guarantor?.name || "Asuransi"}</h1>
              )}
            </>
          )}
        </div>
        <div>
          <Clock />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
