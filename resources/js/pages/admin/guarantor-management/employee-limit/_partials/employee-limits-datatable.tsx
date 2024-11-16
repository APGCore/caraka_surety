import { PaginationDatatable } from "@/components/common/pagination-datatable";
import RenderList from "@/components/common/render-list";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { textCurrency } from "@/lib/text-currency";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import FormEmployeeLimits from "./form-employee-limits";

interface EmployeeLimitsDatatableProps {
  employees: any;
  guarantorSelectedId: number;
  guarantorProductSelectedId: number;
  guarantorProductTypeSelectedId: number;
  profileSelectedId: number;
  onDelete: (limitProfile: any) => void;
}

const EmployeeLimitsDatatable: React.FC<EmployeeLimitsDatatableProps> = ({
  employees,
  guarantorSelectedId,
  guarantorProductSelectedId,
  guarantorProductTypeSelectedId,
  profileSelectedId,
  onDelete,
}) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Karyawan</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={employees?.data}
            render={(employee: any, index: number) => (
              <TableRow key={employee.id}>
                <TableCell>{employees?.meta?.from + index}</TableCell>
                <TableCell>{employee.name}</TableCell>
                <TableCell>
                  {employee.employee_limit?.limit
                    ? "Rp. " + textCurrency(employee.employee_limit?.limit)
                    : "Belum di setting"}
                </TableCell>
                <TableCell>{employee.created_at}</TableCell>
                <TableCell className="text-right">
                  {!guarantorSelectedId || !profileSelectedId ? (
                    <div className="text-center">Pilih Penjamin atau kantor terlebih dahulu</div>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                          <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36 mr-8 mt-1">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <FormEmployeeLimits
                            isEdit={employee.employee_limit?.limit}
                            guarantorSelectedId={guarantorSelectedId}
                            guarantorProductSelectedId={guarantorProductSelectedId}
                            guarantorProductTypeSelectedId={guarantorProductTypeSelectedId}
                            profileSelectedId={profileSelectedId}
                            employee={employee}
                          />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="p-0" onSelect={(e) => e.preventDefault()}>
                          <AlertDialog>
                            <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                              Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                <AlertDialogDescription>Aksi ini akan menghapus data limit ini.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Kembali</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    onDelete(employee.employee_limit);
                                  }}
                                  className={buttonVariants({ variant: "destructive" })}>
                                  Lanjutkan Hapus Limit
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              </TableRow>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={employees?.meta} />
      <PaginationDatatable meta={employees?.meta} only={["profiles"]} />
    </>
  );
};

export default EmployeeLimitsDatatable;
