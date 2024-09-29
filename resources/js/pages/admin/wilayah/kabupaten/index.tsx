import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import TextInput from "@/components/common/text-input";
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
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AdminLayout from "@/layouts/admin";
import { RegencyPageProps } from "@/pages/admin/wilayah/kabupaten/kabupaten-page.type";
import { Head, router, useForm } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useState } from "react";

const getParameterByName = (name: string) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || "";
};

const regencyPage: React.FC<RegencyPageProps> & { layout?: any } = (props) => {
  const { data: regencies, meta } = props.regencies;

  const [select, setSelect] = useState(() =>
    getParameterByName("perpage") ? Number(getParameterByName("perpage")) : 10,
  );
  const [search, setSearch] = useState(() => getParameterByName("search") ?? "");
  const [provinceId, setProvinceId] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);

  const { data, setData, errors, post, put, reset, processing } = useForm({
    code: "",
    name: "",
  });

  const createProvince: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("regencies.store"), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setOpenCreate(false);
      },
    });
  };

  const handleSelect = (e: string) => {
    setSelect(Number(e));
    getData(e, search);
  };

  const handleSearchNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search);
  };

  const getData = (perpage: string, search: string) => {
    return router.get(
      route("regencies.index"),
      pickBy({
        perpage,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const handleSync = () => {
    setLoadingSync(true);
    router.post(
      route("regencies.sync"),
      {
        province_id: provinceId.toString(),
      },
      {
        preserveScroll: true,
        onFinish: () => {
          setLoadingSync(false);
        },
      },
    );
  };

  const updateData: FormEventHandler = (e) => {
    e.preventDefault();

    put(route("regencies.update", data.code), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setOpenEdit(false);
      },
    });
  };

  const deleteData = (regency: any) => {
    router.delete(route("regencies.destroy", regency.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Kabupaten</h1>
        <div className="flex gap-x-3">
          <AlertDialog open={openCreate} onOpenChange={setOpenCreate}>
            <AlertDialogTrigger asChild>
              <Button>Tambah Kabupaten</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Membuat Kabupaten</AlertDialogTitle>
              </AlertDialogHeader>
              <form onSubmit={createProvince} className="mt-6 space-y-6">
                <div>
                  <InputLabel htmlFor="kode" value="Kode Provinsi" />

                  <TextInput
                    id="kode"
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    type="number"
                    className="mt-1 block w-full"
                  />

                  <InputError message={errors.code} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="name" value="Nama Provinsi" />

                  <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    type="text"
                    className="mt-1 block w-full"
                  />

                  <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="flex items-center gap-4 justify-end">
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction type={"submit"} disabled={processing}>
                    Submit
                  </AlertDialogAction>
                </div>
              </form>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={handleSync}>
            {loadingSync && <RotateCw className="animate-spin mr-2" />}
            Sinkron
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <Button>Export</Button>
          <Select onValueChange={(e) => handleSelect(e)} defaultValue={String(select)}>
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
          <form onSubmit={(e) => handleSearchNew(e)} className="flex items-end gap-x-3">
            <Input placeholder="Cari Provinsi" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">#</TableHead>
              <TableHead>Kode</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {regencies.length > 0 ? (
              regencies.map((regency: any, index: number) => (
                <TableRow key={regency.id}>
                  <TableCell>{meta.from + index}</TableCell>
                  <TableCell>{regency.code}</TableCell>
                  <TableCell>{regency.name}</TableCell>
                  <TableCell>{regency.created_at}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                          <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36 mr-8 mt-1">
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
                            <AlertDialogTrigger
                              className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-amber-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                              onClick={() => {
                                setData({
                                  code: regency.code,
                                  name: regency.name,
                                });
                              }}>
                              Edit
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mengubah Provinsi</AlertDialogTitle>
                              </AlertDialogHeader>
                              <form onSubmit={updateData} className="mt-6 space-y-6">
                                <div>
                                  <InputLabel htmlFor="id" value="Kode Provinsi" />

                                  <TextInput
                                    id="id"
                                    value={data.code}
                                    onChange={(e) => setData("code", e.target.value)}
                                    type="number"
                                    className="mt-1 block w-full"
                                  />

                                  <InputError message={errors.code} className="mt-2" />
                                </div>

                                <div>
                                  <InputLabel htmlFor="name" value="Nama Provinsi" />

                                  <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    type="text"
                                    className="mt-1 block w-full"
                                  />

                                  <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="flex items-center justify-end gap-4">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction type={"submit"} disabled={processing}>
                                    {processing && <RotateCw className="animate-spin mr-2" />}
                                    Update
                                  </AlertDialogAction>
                                </div>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="p-0" onSelect={(e) => e.preventDefault()}>
                          <AlertDialog>
                            <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                              Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini akan menghapus data provinsi {regency.name}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    deleteData(regency);
                                  }}
                                  className={buttonVariants({ variant: "destructive" })}>
                                  Continue Delete
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
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-sm text-gray-500">
        Showing {meta.from} to {meta.to} of {meta.total} results
      </div>
      <Pagination>
        <PaginationContent>
          {meta.links.map((link: any, index: number) => {
            return (
              <PaginationItem key={index + 1}>
                {link.url === null ? (
                  <Button variant="ghost" disabled>
                    {link.label}
                  </Button>
                ) : (
                  <PaginationLink
                    as="button"
                    preserveScroll
                    preserveState
                    only={["regencies"]}
                    isActive={link.active}
                    size={
                      link.label === "Previous" ||
                      link.label === "Next" ||
                      link.label === "Sebelumnya" ||
                      link.label === "Berikutnya"
                        ? "default"
                        : "icon"
                    }
                    href={link.url}>
                    {link.label}
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          })}
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default regencyPage;

regencyPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{pagePropsData?.page_settings?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </AdminLayout>
  );
};
