import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/_features/_common/components/_shadcn-ui/select";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/_features/_common/components/_shadcn-ui/table";
import { PrimaryButton } from "@/_features/_common/components/button/primary-button";
import { Link } from "@inertiajs/react";

const ListEmployeeOfficePage = () => {
  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Pengguna</h1>
        <div className="flex gap-x-3">
          <PrimaryButton asChild>
            <Link
              href="#"
              // href={route(`${props.route_name || ""}.create`) + `?office_id=${office_selected}`}
            >
              Tambah Pengguna
            </Link>
          </PrimaryButton>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <Select>
            <SelectTrigger className="w-max">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-x-3">
          <form
          // onSubmit={handleSearchSubmit} className="flex items-end gap-x-3"
          >
            <Input
              className="h-full"
              placeholder="Cari Pengguna"
              // value={search}
              // onChange={(e) => setSearch(e.target.value)}
            />
            <PrimaryButton type="submit">Cari</PrimaryButton>
          </form>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">#</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Jabatan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* {employees.length > 0 ? (
              employees.map((employee: any, index: number) => (
                <TableRow key={employee.id}>
                  <TableCell>{meta.from + index}</TableCell>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.username}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                          <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36 mr-8 mt-1">
                        <DropdownMenuItem className="p-0 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                          <Dialog>
                            <DialogTrigger className="bg-black text-destructive-foreground shadow-sm hover:bg-black/60 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                              Show
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                              <DialogHeader>
                                <DialogTitle>{employee?.name}</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 grid gap-2">
                                <div className="flex items-center justify-between">
                                  <span className="font-normal">Nama</span>
                                  <span>{employee?.name}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-normal">Username</span>
                                  <span>{employee?.username}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-normal">Email</span>
                                  <span>{employee?.email ?? "Email Belum Dimasukan"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-normal">No. Telepon</span>
                                  <span>{employee?.phone}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-normal">Jabatan</span>
                                  <span>{employee?.position}</span>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer p-0" onSelect={(e) => e.preventDefault()}>
                          <Link
                            href={route(`${props.route_name || ""}.edit`, employee.id)}
                            className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-amber-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="p-0 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                          <AlertDialog>
                            <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                              Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini akan menghapus data pengguna {employee.name}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    deleteData(employee);
                                  }}
                                  className={buttonVariants({
                                    variant: "destructive",
                                  })}>
                                  Lanjutkan Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )} */}
          </TableBody>
        </Table>
      </div>
      {/* <ShowingCountDatatable meta={meta} /> */}
      {/* <PaginationDatatable meta={meta} /> */}
    </main>
  );
};

export default ListEmployeeOfficePage;
