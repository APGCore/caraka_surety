import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/_features/_common/components/_shadcn-ui/table";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";

interface DetailRegencyModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  regency: any;
}

const DetailRegencyModal = ({ open, handleOpen, regency }: DetailRegencyModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detail Kabupaten/Kota</AlertDialogTitle>
          <AlertDialogDescription>Menampilkan data kabupaten/kota {regency?.name}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/3">Kode Kabupaten/Kota</TableCell>
                <TableCell>{regency?.code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nama Kabupaten/Kota</TableCell>
                <TableCell>{regency?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dibuat Pada</TableCell>
                <TableCell>{new Date(regency?.created_at || "").toLocaleDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Diperbarui Pada</TableCell>
                <TableCell>{new Date(regency?.updated_at || "").toLocaleDateString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center gap-4 justify-end mt-6">
          <Button
            variant={"outline"}
            onClick={(e) => {
              handleBubbleEvent(e);
              handleOpen?.(false);
            }}>
            Tutup
          </Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DetailRegencyModal;
