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
import { GUARANTOR_PRODUCT_TYPE_LIMIT_QUERY_KEY } from "@/_features/limit/services/product-type-limit-query";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { router } from "@inertiajs/react";
import { CircleAlertIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";

interface DeleteProductTypeLimitModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  guarantorProductType?: any;
}

export default function DeleteProductTypeLimitModal({
  open,
  handleOpen,
  guarantorProductType,
}: DeleteProductTypeLimitModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);

    console.log(route("guarantor-product-type-limit.destroy", { id: guarantorProductType.id }));
    router.delete(
      route("guarantor-product-type-limit.destroy", {
        id: guarantorProductType.id,
      }),
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [GUARANTOR_PRODUCT_TYPE_LIMIT_QUERY_KEY.GUARANTOR_PRODUCT_TYPE_LIMIT],
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
            <AlertDialogTitle className="sm:text-center">Hapus Limit Kewenangan Jaminan</AlertDialogTitle>
            <AlertDialogDescription className="sm:text-center">
              Anda akan menghapus limit kewenangan jaminan
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
