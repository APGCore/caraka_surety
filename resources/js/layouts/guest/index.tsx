import useFlashMessageToast from "@/common/hooks/general/use-flash-message";
import { Toaster } from "@/components/_shadcn-ui/toaster";
import { GuestLayoutPageProps } from "./guest-layout.type";

const GuestLayoutPage: GuestLayoutPageProps = ({ children }) => {
  useFlashMessageToast();
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC]">
      <div className="w-full">{children}</div>
      <Toaster />
    </div>
  );
};

export default GuestLayoutPage;
