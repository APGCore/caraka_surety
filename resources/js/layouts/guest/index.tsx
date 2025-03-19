import useFlashMessageToast from "@/common/hooks/general/use-flash-message";
import { Toaster } from "@/components/_shadcn-ui/toaster";
import { GuestLayoutPageProps } from "./guest-layout.type";

const GuestLayoutPage: GuestLayoutPageProps = ({ children }) => {
  useFlashMessageToast();
  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-0 sm:justify-center sm:pt-0">
      <div>{children}</div>
      <Toaster />
    </div>
  );
};

export default GuestLayoutPage;
