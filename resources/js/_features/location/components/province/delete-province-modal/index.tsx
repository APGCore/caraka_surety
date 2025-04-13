import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { PROVINCE_LOCATION_QUERY_KEY } from "@/_features/location/services/province-location-query";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { router } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { useState } from "react";

interface DeleteProvinceModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  province: any;
}

const DeleteProvinceModal = ({ open, handleOpen, province }: DeleteProvinceModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);
    router.delete(
      route("province.destroy", {
        id: province.id,
      }),
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [PROVINCE_LOCATION_QUERY_KEY.SEARCH_PROVINCE],
              refetchType: "active",
            }),
            queryClient.invalidateQueries({
              queryKey: [PROVINCE_LOCATION_QUERY_KEY.GET_ALL_PROVINCE],
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
          <AlertDialogTitle>Hapus Provinsi</AlertDialogTitle>
          <AlertDialogDescription>Tindakan ini akan menghapus data provinsi</AlertDialogDescription>
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

export default DeleteProvinceModal;
