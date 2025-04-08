import { useGetAllProvince, useSearchProvinces } from "@/_features/location/services/location-query";
import { getQueryParameter } from "@/common/utils/get-query-parameter";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/_shadcn-ui/alert-dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/_shadcn-ui/breadcrumb";
import { Button, buttonVariants } from "@/components/_shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import InputError from "@/components/molecules/input/error-input";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { ProvincePageProps } from "@/pages/admin/location/province/provinsi-page.type";
import { Head, router, useForm } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useState } from "react";

const ProvincePage: React.FC<ProvincePageProps> & { layout?: any } = (props) => {
  const { data: provinces, meta } = props.provinces;

  const {
    data: provincess,
    isLoading: isLoadingProvinces,
    isSuccess: isSuccessProvinces,
  } = useSearchProvinces({
    perPage: 10,
    search: "",
    page: 1,
  });

  console.log(provincess);

  const [select, setSelect] = useState(() =>
    getQueryParameter("per_page") ? Number(getQueryParameter("per_page")) : 10,
  );
  const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);

  const { data, setData, errors, post, put, reset, processing } = useForm({
    id: "",
    code: "",
    name: "",
  });

  const createProvince: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("province.store"), {
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

  const getData = (perPage: string, search: string) => {
    return router.get(
      route("province.index"),
      pickBy({
        per_page: perPage,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const handleSync = () => {
    setLoadingSync(true);
    router.post(
      route("province.sync"),
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          setLoadingSync(false);
        },
      },
    );
  };

  const updateProvince: FormEventHandler = (e) => {
    e.preventDefault();

    put(route("province.update", data.id), {
      preserveScroll: true,
      onSuccess: () => {
        reset();
        setOpenEdit(false);
      },
    });
  };

  const deleteProvince = (province: any) => {
    router.delete(route("province.destroy", province.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Provinsi</h1>
        <div className="flex gap-x-3">
          <AlertDialog open={openCreate} onOpenChange={setOpenCreate}>
            <AlertDialogTrigger asChild>
              <Button>Tambah Provinsi</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Membuat Provinsi</AlertDialogTitle>
                <AlertDialogDescription>Tindakan ini akan menambah data provinsi</AlertDialogDescription>
              </AlertDialogHeader>
              <form onSubmit={createProvince} className="mt-6 space-y-6">
                <div>
                  <Label htmlFor="kode">Kode Provinsi</Label>
                  <Input
                    id="kode"
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    type="text"
                    className="mt-1 block w-full"
                  />
                  <InputError message={errors.code} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="name">Nama Provinsi</Label>
                  <Input
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
                  <Button type={"submit"} disabled={processing}>
                    {processing && <RotateCw className="animate-spin mr-2" />}
                    Submit
                  </Button>
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
            {provinces.length > 0 ? (
              provinces.map((province: any, index: number) => (
                <TableRow key={province.id}>
                  <TableCell>{meta.from + index}</TableCell>
                  <TableCell>{province.code}</TableCell>
                  <TableCell>{province.name}</TableCell>
                  <TableCell>{province.created_at}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                          <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36 mr-8 mt-1">
                        <DropdownMenuItem className="cursor-pointer p-0" onSelect={(e) => e.preventDefault()}>
                          <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
                            <AlertDialogTrigger
                              className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-amber-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                              onClick={() => {
                                setData({
                                  id: province.id,
                                  code: province.code,
                                  name: province.name,
                                });
                              }}>
                              Edit
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mengubah Provinsi</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini akan mengubah data provinsi {province.name}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <form onSubmit={updateProvince} className="mt-6 space-y-6">
                                <div>
                                  <Label htmlFor="id">Kode Provinsi</Label>
                                  <Input
                                    id="id"
                                    value={data.code}
                                    onChange={(e) => setData("code", e.target.value)}
                                    type="number"
                                    className="mt-1 block w-full"
                                  />
                                  <InputError message={errors.code} className="mt-2" />
                                </div>
                                <div>
                                  <Label htmlFor="name">Nama Provinsi</Label>
                                  <Input
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
                                  <Button type={"submit"} disabled={processing}>
                                    {processing && <RotateCw className="animate-spin mr-2" />}
                                    Update
                                  </Button>
                                </div>
                              </form>
                            </AlertDialogContent>
                          </AlertDialog>
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
                                  Tindakan ini akan menghapus data provinsi {province.name}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button
                                  onClick={() => {
                                    deleteProvince(province);
                                  }}
                                  className={buttonVariants({
                                    variant: "destructive",
                                  })}>
                                  Continue Delete province
                                </Button>
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
      <ShowingCountDatatable meta={meta} />
      <PaginationDatatable meta={meta} />
    </main>
  );
};

export default ProvincePage;

ProvincePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <Head title={pagePropsData?.page_settings?.title} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{pagePropsData?.page_settings?.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {page}
    </RoleBasedLayout>
  );
};
