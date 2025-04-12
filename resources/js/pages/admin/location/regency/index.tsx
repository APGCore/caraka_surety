import { useSearchRegencies } from "@/_features/location/services/regency-location-query";
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
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "@/components/_shadcn-ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import { Combobox } from "@/components/molecules/combobox";
import InputError from "@/components/molecules/input/error-input";
import InputLabel from "@/components/molecules/input/label-input";
import TextInput from "@/components/molecules/input/text-input";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { RegencyPageProps } from "@/pages/admin/location/regency/kabupaten-page.type";
import { Head, router, useForm } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";

const getParameterByName = (name: string) => {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) || "";
};

const regencyPage: React.FC<RegencyPageProps> & { layout?: any } = (props) => {
  const provinces = props.provinces;
  const { data: regencies, meta } = props.regencies;

  const { data, setData, errors, post, put, reset, processing } = useForm({
    id: "",
    province_id: "",
    code: "",
    name: "",
  });

  const [select, setSelect] = useState(() =>
    getParameterByName("per_page") ? Number(getParameterByName("per_page")) : 10,
  );
  const [search, setSearch] = useState(() => getParameterByName("search") ?? "");
  const [provinceCode, setProvinceCode] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  useEffect(() => {
    if (errors.province_id || errors.code || errors.name) {
      setOpenCreate(true);
    }
  }, [errors.province_id, errors.code, errors.name]);
  const [openEdit, setOpenEdit] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);

  const createData: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("regency.store"), {
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
      route("regency.index"),
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
      route("regency.sync"),
      {
        code: provinceCode.toString(),
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

    put(route("regency.update", data.id), {
      preserveState: true,
      preserveScroll: false,
      onSuccess: () => {
        reset();
        setOpenEdit(false);
      },
    });
  };

  const deleteData = (regency: any) => {
    router.delete(route("regency.destroy", regency.id));
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
              <form onSubmit={createData} className="mt-6 space-y-6">
                <div>
                  <InputLabel htmlFor="province_id" value="Pilih Provinsi" />

                  <Combobox
                    id="province_id"
                    datas={provinces}
                    labelKey={"name"}
                    valueKey={"name"}
                    placeholder={"Pilih Provinsi"}
                    onSelect={(value) => setData("province_id", value.id)}
                    className="mt-1 w-full"
                  />

                  <InputError message={errors.province_id} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="kode" value="Kode Kabupaten" />

                  <TextInput
                    id="kode"
                    value={data.code}
                    onChange={(e) => setData("code", e.target.value)}
                    type="text"
                    className="mt-1 block w-full"
                  />

                  <InputError message={errors.code} className="mt-2" />
                </div>

                <div>
                  <InputLabel htmlFor="name" value="Nama Kabupaten" />

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
                  <Button type={"submit"} disabled={processing}>
                    Submit
                  </Button>
                </div>
              </form>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex items-center justify-end">
        <div className="flex gap-x-3">
          <Combobox
            datas={provinces}
            labelKey={"name"}
            valueKey={"name"}
            placeholder={"Pilih Provinsi"}
            className={"w-[210px]"}
            onSelect={(value) => setProvinceCode(value.code)}
          />
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
            <Input placeholder="Cari Kabupaten" value={search} onChange={(e) => setSearch(e.target.value)} />
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
              <TableHead>Provinsi</TableHead>
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
                  <TableCell>{regency.province}</TableCell>
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
                                  id: regency.id,
                                  province_id: regency.province_id,
                                  code: regency.code,
                                  name: regency.name,
                                });
                              }}>
                              Edit
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Mengubah Kabupaten</AlertDialogTitle>
                              </AlertDialogHeader>
                              <form onSubmit={updateData} className="mt-6 space-y-6">
                                <div>
                                  <InputLabel htmlFor="province_id" value="Pilih Provinsi" />

                                  <Combobox
                                    datas={provinces}
                                    labelKey={"name"}
                                    valueKey={"name"}
                                    placeholder={"Pilih Provinsi"}
                                    onSelect={(value) => setData("province_id", value.id)}
                                    className="mt-1 w-full"
                                  />
                                </div>

                                <div>
                                  <InputLabel htmlFor="kode" value="Kode Kabupaten" />

                                  <TextInput
                                    id="kode"
                                    value={data.code}
                                    onChange={(e) => setData("code", e.target.value)}
                                    type="string"
                                    className="mt-1 block w-full"
                                  />

                                  <InputError message={errors.code} className="mt-2" />
                                </div>

                                <div>
                                  <InputLabel htmlFor="name" value="Nama Kabupaten" />

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
                        <DropdownMenuItem className="p-0" onSelect={(e) => e.preventDefault()}>
                          <AlertDialog>
                            <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                              Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini akan menghapus data Kabupaten {regency.name}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <Button
                                  onClick={() => {
                                    deleteData(regency);
                                  }}
                                  className={buttonVariants({
                                    variant: "destructive",
                                  })}>
                                  Continue Delete
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
