import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/_shadcn-ui/alert-dialog";
import { Button } from "@/components/_shadcn-ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/_shadcn-ui/table";

interface DetailDistrictModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  district: any;
}

const DetailDistrictModal = ({ open, handleOpen, district }: DetailDistrictModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Detail Kecamatan</AlertDialogTitle>
          <AlertDialogDescription>Menampilkan data {district?.name}</AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-4">
          <Table>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium w-1/3">Kode Kecamatan</TableCell>
                <TableCell>{district?.code}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Nama Kecamatan</TableCell>
                <TableCell>{district?.name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Dibuat Pada</TableCell>
                <TableCell>{new Date(district?.created_at || "").toLocaleDateString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Diperbarui Pada</TableCell>
                <TableCell>{new Date(district?.updated_at || "").toLocaleDateString()}</TableCell>
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

export default DetailDistrictModal;
