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

interface DetailHostToHostModalProps {
  open: boolean;
  handleOpen: (open: boolean) => void;
  hostToHost: any;
}

export default function DetailHostToHostModal({ open, handleOpen, hostToHost }: DetailHostToHostModalProps) {
  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent className="flex flex-col gap-0 p-0 sm:max-h-[min(640px,80vh)] sm:max-w-lg [&>button:last-child]:hidden">
        <div className="overflow-y-auto">
          <AlertDialogHeader className="contents space-y-0 text-left">
            <AlertDialogTitle className="px-6 pt-6 text-lg">Detail Host to Host</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="p-6">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium w-1/3">Nama Asuransi</TableCell>
                      <TableCell>{hostToHost?.guarantor_name || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Alamat Host Asuransi</TableCell>
                      <TableCell>{hostToHost?.guarantor_url_host || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Prefix Auth</TableCell>
                      <TableCell>{hostToHost?.auth_prefix || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Token</TableCell>
                      <TableCell>{hostToHost?.token || "-"}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Dibuat Pada</TableCell>
                      <TableCell>{new Date(hostToHost?.created_at || "-").toLocaleDateString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>
        <AlertDialogFooter className="border-t px-6 py-4">
          <Button
            onClick={(e) => {
              handleBubbleEvent(e);
              handleOpen?.(false);
            }}>
            Tutup
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
