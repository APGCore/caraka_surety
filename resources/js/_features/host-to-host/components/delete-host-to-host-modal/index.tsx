import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { router } from "@inertiajs/react";
import axios from "axios";
import { CircleAlertIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { HOST_TO_HOST_QUERY_KEY } from "../../services/host-to-host-query";

interface DeleteHostToHostModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  hostToHost?: any;
}

export default function DeleteHostToHostModal({ open, handleOpen, hostToHost }: DeleteHostToHostModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);

    // axios
    //   .delete(
    //     route("host-to-host.delete", {
    //       id: hostToHost.id,
    //     }),
    //   )
    //   .then(async (res) => {
    //     await Promise.all([
    //       queryClient.invalidateQueries({
    //         queryKey: [HOST_TO_HOST_QUERY_KEY.SEARCH_HOST_TO_HOST],
    //         refetchType: "active",
    //       }),
    //     ]);
    //     handleOpen?.(false);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });

    router.delete(
      route("host-to-host.delete", {
        id: hostToHost.id,
      }),
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [HOST_TO_HOST_QUERY_KEY.SEARCH_HOST_TO_HOST],
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

  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent className="max-w-md">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-red-500 "
            aria-hidden="true">
            <CircleAlertIcon className="opacity-80 text-red-500" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="sm:text-center">Hapus Host to Host</AlertDialogTitle>
            <AlertDialogDescription className="sm:text-center">
              Anda akan menghapus host to host dengan <br />
              <span className="font-bold">{hostToHost?.guarantor_name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <AlertDialogFooter>
          <Button
            variant={"outline"}
            type="button"
            className="flex-1"
            onClick={(e) => {
              handleBubbleEvent(e);
              handleOpen?.(false);
            }}>
            Batal
          </Button>
          <Button variant={"destructive"} type="button" disabled={isLoading} className="flex-1" onClick={handleDelete}>
            {isLoading && <LoaderCircle className="animate-spin mr-1" />}
            Hapus
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
