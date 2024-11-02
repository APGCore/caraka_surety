import { Toaster } from "@/components/ui/toaster";
import useFlashMessageToast from "@/hooks/general/use-flash-message";
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
