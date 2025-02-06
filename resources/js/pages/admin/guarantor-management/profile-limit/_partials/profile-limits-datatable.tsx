import { textCurrency } from "@/common/utils/text-currency";
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
} from "@/components/_shadcn-ui/alert-dialog";
import { Button, buttonVariants } from "@/components/_shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import FormProfileLimits from "./form-profile-limits";

interface ProfileLimitsDatatableProps {
  profiles: any;
  guarantorSelectedId: number;
  guarantorProductId: number;
  guarantorProductTypeId: number;
  guarantorToProductTypeId: number;
  jobGroupSelected: string;
  jobTypeSelected: string;
  onDelete: (limitProfile: any) => void;
}

const ProfileLimitsDatatable: React.FC<ProfileLimitsDatatableProps> = ({
  profiles,
  guarantorSelectedId,
  guarantorProductId,
  guarantorProductTypeId,
  guarantorToProductTypeId,
  jobGroupSelected,
  jobTypeSelected,
  onDelete,
}) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Kantor</TableHead>
            <TableHead>Limit</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={profiles?.data}
            render={(profile: any, index: number) => (
              <TableRow key={profile.id}>
                <TableCell>{profiles.meta?.from + index}</TableCell>
                <TableCell>{profile.name}</TableCell>
                <TableCell>
                  {profile.profile_limit?.limit
                    ? "Rp. " + textCurrency(profile.profile_limit?.limit)
                    : "Belum Di setting"}
                </TableCell>
                <TableCell>{profile.created_at}</TableCell>
                <TableCell className="text-right">
                  {(!guarantorSelectedId && <div className="text-center">Pilih Penjamin terlebih dahulu</div>) || (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                          <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36 mr-8 mt-1">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <FormProfileLimits
                            isEdit={profile.profile_limit?.limit != undefined}
                            guarantorSelectedId={guarantorSelectedId}
                            guarantorProductId={guarantorProductId}
                            guarantorProductTypeId={guarantorProductTypeId}
                            guarantorToProductTypeId={guarantorToProductTypeId}
                            jobGroupSelected={jobGroupSelected}
                            jobTypeSelected={jobTypeSelected}
                            profile={profile}
                          />
                        </DropdownMenuItem>
                        <Show when={profile.profile_limit?.limit}>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="p-0" onSelect={(e) => e.preventDefault()}>
                            <AlertDialog>
                              <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                                Delete
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Aksi ini akan menghapus data limit ini.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Kembali</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      onDelete(profile.profile_limit);
                                    }}
                                    className={buttonVariants({ variant: "destructive" })}>
                                    Lanjutkan Hapus Limit
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                        </Show>
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
      <ShowingCountDatatable meta={profiles?.meta} />
      <PaginationDatatable meta={profiles?.meta} only={["profiles"]} />
    </>
  );
};

export default ProfileLimitsDatatable;
