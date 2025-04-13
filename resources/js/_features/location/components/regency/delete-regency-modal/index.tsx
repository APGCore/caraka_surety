import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { REGENCY_LOCATION_QUERY_KEY } from "@/_features/location/services/regency-location-query";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { router } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { useState } from "react";

interface DeleteRegencyModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  regency: any;
}

const DeleteRegencyModal = ({ open, handleOpen, regency }: DeleteRegencyModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);
    router.delete(
      route("regency.destroy", {
        id: regency.id,
      }),
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [REGENCY_LOCATION_QUERY_KEY.SEARCH_REGENCY],
              refetchType: "active",
            }),
            queryClient.invalidateQueries({
              queryKey: [REGENCY_LOCATION_QUERY_KEY.GET_ALL_REGENCY],
              refetchType: "active",
            }),
          ]);
          handleOpen?.(false);
        },
        onFinish: () => {
          setIsLoading(false);
        },
      },
    );
  };

  if (!open) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Kota/Kabupaten</AlertDialogTitle>
          <AlertDialogDescription>Tindakan ini akan menghapus data kota/kabupaten</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-4 justify-end">
          <Button
            variant={"outline"}
            onClick={(e) => {
              handleBubbleEvent(e);
              handleOpen?.(false);
            }}>
            Batal
          </Button>
          <Button
            variant={"destructive"}
            disabled={isLoading}
            onClick={(e) => {
              handleBubbleEvent(e);
              handleDelete();
            }}>
            {isLoading && <RotateCw className="animate-spin mr-2" />}
            Hapus
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteRegencyModal;
