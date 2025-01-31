import useFlashMessageToast from "@/common/hooks/general/use-flash-message";
import { Toaster } from "@/components/_shadcn-ui/toaster";
import React from "react";

interface AppLayoutProps extends React.PropsWithChildren {}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  useFlashMessageToast();

  return (
    <div className="min-h-svh bg-muted/40 shadow-sm">
      {/* <Navbar /> */}
      {children}
      <Toaster />
    </div>
  );
};

export default AppLayout;
