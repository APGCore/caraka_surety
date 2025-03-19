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
        });
      } else if (flash_message.type === "error") {
        toast({
          title: flash_message.title,
          description: flash_message.description,
          variant: "destructive",
        });
      }
    }
  }, [flash_message]);

  return null;
};

export default useFlashMessageToast;
