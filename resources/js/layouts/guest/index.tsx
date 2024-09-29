import { Toaster } from "@/components/ui/toaster";
import useFlashMessageToast from "@/hooks/use-flash-message";
import React from "react";
import { GuestLayoutProps } from "./guest-layout.type";

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
  useFlashMessageToast();
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
      <div>{children}</div>
      <Toaster />
    </div>
  );
};

export default GuestLayout;
