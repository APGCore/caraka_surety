import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/_features/_common/components/_shadcn-ui/table";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { CircleAlertIcon, LoaderCircle } from "lucide-react";
import { useState } from "react";

interface DeleteHostToHostModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  hostToHost?: any;
}

export default function DeleteHostToHostModal({ open, handleOpen, hostToHost }: DeleteHostToHostModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      handleOpen?.(false);
    }, 1000);
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
