import { Toaster } from "@/components/ui/toaster";
import useFlashMessageToast from "@/hooks/use-flash-message";
import { GuestLayoutPageProps } from "./guest-layout.type";

const GuestLayoutPage: GuestLayoutPageProps = ({ children }) => {
  useFlashMessageToast();
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
      <div>{children}</div>
      <Toaster />
    </div>
  );
};

export default GuestLayoutPage;
