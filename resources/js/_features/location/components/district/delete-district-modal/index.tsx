import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { DISTRICT_LOCATION_QUERY_KEY } from "@/_features/location/services/district-location-query";
import { router } from "@inertiajs/react";
import { useState } from "react";
import { Button } from "@/components/_shadcn-ui/button";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { RotateCw } from "lucide-react";
import { queryClient } from "@/components/organisms/provider/react-query-provider";

interface DeleteDistrictModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  district: any;
}

const DeleteDistrictModal = ({ open, handleOpen, district }: DeleteDistrictModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);
    router.delete(
      route("district.destroy", {
        id: district.id,
      }),
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [DISTRICT_LOCATION_QUERY_KEY.SEARCH_DISTRICT],
              refetchType: "active",
            }),
            queryClient.invalidateQueries({
              queryKey: [DISTRICT_LOCATION_QUERY_KEY.GET_ALL_DISTRICT],
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

export default DeleteDistrictModal;
