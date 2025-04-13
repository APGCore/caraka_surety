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

interface DetailProvinceModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  province: any;
}

const DetailProvinceModal = ({ open, handleOpen, province }: DetailProvinceModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detail Provinsi</AlertDialogTitle>
          <AlertDialogDescription>Menampilkan data provinsi {province?.name}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/3">Kode Provinsi</TableCell>
                <TableCell>{province?.code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nama Provinsi</TableCell>
                <TableCell>{province?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dibuat Pada</TableCell>
                <TableCell>{new Date(province?.created_at || "").toLocaleDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Diperbarui Pada</TableCell>
                <TableCell>{new Date(province?.updated_at || "").toLocaleDateString()}</TableCell>
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

export default DetailProvinceModal;
