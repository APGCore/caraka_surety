import { toast } from "@/common/hooks/general/use-toast";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";

const useFlashMessageToast = () => {
  const { flash_message } = usePage().props;

  useEffect(() => {
    if (flash_message && flash_message.title && flash_message.description && flash_message.type) {
      if (flash_message.type === "success") {
        toast({
          title: flash_message.title,
          description: flash_message.description,
          duration: 25000,
        });
      } else if (flash_message.type === "error") {
        toast({
          title: flash_message.title,
          description: flash_message.description,
          variant: "destructive",
          duration: 25000,
        });
      }
    }
    if (flash_message && flash_message.messages && flash_message.messages.length > 0) {
      flash_message.messages.forEach((message: any) => {
        if (message.type === "success") {
          toast({
            title: message.title,
            description: message.description,
            duration: 25000,
          });
        } else if (message.type === "error") {
          toast({
            title: message.title,
            description: message.description,
            variant: "destructive",
            duration: 25000,
          });
        }
      });
    }
  }, [flash_message]);

  return null;
};

export default useFlashMessageToast;
