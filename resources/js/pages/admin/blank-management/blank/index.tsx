import { toast } from "@/common/hooks/general/use-toast";
import { getQueryParameter } from "@/common/utils/get-query-parameter";
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
import { Badge } from "@/components/_shadcn-ui/badge";
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
import Loading from "@/components/atoms/loading";
import Show from "@/components/atoms/show";
import { Combobox } from "@/components/molecules/combobox";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import InputError from "@/components/molecules/input/error-input";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { BlankPageProps } from "@/pages/admin/blank-management/blank/blank-page.type";
import { BlankUtils } from "@/pages/admin/blank-management/blank/blank.utils";
import { Head, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { pickBy } from "lodash";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";

const BlankPage: BlankPageProps = ({
  guarantors,
  guarantorBranches,
  guarantorSelected,
  guarantorBranchSelected,
  ...props
}) => {
  const { data: blanks, meta } = props.blanks;

  const [select, setSelect] = useState(() =>
    getQueryParameter("per_page") ? Number(getQueryParameter("per_page")) : 10,
  );
  const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");
  const [openCreateMulti, setOpenCreateMulti] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  type DataForm = {
    id?: number;
    number: string;
  };
  const defaultDataForm: DataForm = {
    number: "",
  };
  const [dataForm, setDataForm] = useState<DataForm>(defaultDataForm);
  const [errors, setErrors] = useState<{ number: Array<string> | null }>({
    number: null,
  });
  type DataCreateMulti = {
    number_start: string;
    number_end: string;
  };
  const defaultDataCreateMulti: DataCreateMulti = {
    number_start: "",
    number_end: "",
  };
  const [dataCreateMulti, setDataCreateMulti] = useState<DataCreateMulti>(defaultDataCreateMulti);
  const [errorsMulti, setErrorsMulti] = useState<{
    number_start: Array<string> | null;
    number_end: Array<string> | null;
  }>({
    number_start: null,
    number_end: null,
  });

  const handleSelect = (e: string) => {
    setSelect(Number(e));
    getData(e, search, guarantorSelected);
  };

  const handleSearchNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search, guarantorSelected);
  };

  const getData = (perPage: string, search: string, officeSelected: number) => {
    return router.get(
      route(BlankUtils.link.index),
      pickBy({
        per_page: perPage,
        search,
        guarantor_id: officeSelected,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const setGuarantor = (office: any, branch: any = null) => {
    return router.get(
      route(BlankUtils.link.index),
      pickBy({
        guarantor_id: office.id,
        guarantor_branch_id: branch?.id,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteData = (blank: any) => {
    router.delete(route(BlankUtils.link.destroy, blank.id));
  };

  const createBlangkoMulti = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .post(route(BlankUtils.link.store_multi), { ...dataCreateMulti, guarantor_id: guarantorSelected })
      .then(() => {
        setOpenCreateMulti(false);
        setDataCreateMulti(defaultDataCreateMulti);
        getData(String(select), search, guarantorSelected);
        toast({
          title: "Berhasil",
          description: "Data Blangko berhasil ditambahkan",
        });
        clear();
      })
      .catch((error) => {
        setOpenCreateMulti(true);
        setErrorsMulti(error.response.data.errors);
        console.log(error.response);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const updateBlangko = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    axios
      .put(route(BlankUtils.link.update, dataForm.id), { ...dataForm, guarantor_id: guarantorSelected })
      .then(() => {
        setOpenEdit(false);
        setDataForm(defaultDataForm);
        getData(String(select), search, guarantorSelected);
        toast({
          title: "Berhasil",
          description: "Data Blangko berhasil diubah",
        });
        clear();
      })
      .catch((error) => {
        setOpenEdit(true);
        setErrors(error.response.data.errors);
        toast({
          title: "Gagal",
          description: error.response.data.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const clear = () => {
    setDataForm(defaultDataForm);
    setDataCreateMulti(defaultDataCreateMulti);
    setErrors({ number: null });
    setErrorsMulti({ number_start: null, number_end: null });
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Penerimaan Blangko</h1>
        <div className="flex gap-x-3">
          <AlertDialog open={openCreateMulti} onOpenChange={setOpenCreateMulti}>
            <AlertDialogTrigger asChild>
              <Button>Tambah Blangko</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tambah Blangko</AlertDialogTitle>
                <AlertDialogDescription>Tindakan ini akan menambah data Blangko</AlertDialogDescription>
              </AlertDialogHeader>
              <form onSubmit={(e) => createBlangkoMulti(e)} className="mt-6 space-y-6">
                <div className="flex items-center justify-around">
                  <div>
                    <Label htmlFor="number">Nomor Blangko Pertama</Label>
                    <Input
                      id="number"
                      value={dataCreateMulti.number_start}
                      onChange={(e) =>
                        setDataCreateMulti({
                          ...dataCreateMulti,
                          number_start: e.target.value,
                        })
                      }
                      type="text"
                      className="mt-1 block w-full"
                    />

                    {(errorsMulti?.number_start?.length ?? 0) > 0 &&
                      errorsMulti?.number_start?.map((error: string, index: number) => (
                        <InputError key={index} message={error} />
                      ))}
                  </div>

                  <ArrowRight className="mt-7" />

                  <div>
                    <Label htmlFor="number">Nomor Blangko Terakhir</Label>
                    <Input
                      id="number"
                      value={dataCreateMulti.number_end}
                      onChange={(e) =>
                        setDataCreateMulti({
                          ...dataCreateMulti,
                          number_end: e.target.value,
                        })
                      }
                      type="text"
                      className="mt-1 block w-full"
                    />

                    {(errorsMulti?.number_end?.length ?? 0) > 0 &&
                      errorsMulti?.number_end?.map((error: string, index: number) => (
                        <InputError key={index} message={error} />
                      ))}
                  </div>
                </div>

                <div className="flex justify-end gap-x-3">
                  <AlertDialogCancel
                    onClick={() => {
                      clear();
                      setOpenCreateMulti(false);
                    }}>
                    Batal
                  </AlertDialogCancel>
                  <Button type={"submit"} disabled={isLoading}>
                    Simpan <Loading isLoading={isLoading} />
                  </Button>
                </div>
              </form>
            </AlertDialogContent>
          </AlertDialog>
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
          <Combobox
            datas={guarantors}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorSelected}
            placeholder={"Pilih Asuransi"}
            className={"w-[210px]"}
            onSelect={(value) => setGuarantor(value)}
          />
          {/*<Combobox*/}
          {/*  datas={guarantorBranches}*/}
          {/*  labelKey={"name"}*/}
          {/*  valueKey={"name"}*/}
          {/*  defaultValue={guarantorBranchSelected}*/}
          {/*  placeholder={"Pilih Cabang Asuransi"}*/}
          {/*  className={"w-[210px]"}*/}
          {/*  onSelect={(value) => setGuarantor(guarantorSelected, value)}*/}
          {/*/>*/}
        </div>
        <div className="flex gap-x-3">
          <form onSubmit={(e) => handleSearchNew(e)} className="flex items-end gap-x-3">
            <Input placeholder="Cari Blangko" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">#</TableHead>
              <TableHead>Nomor Blangko</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {blanks.length > 0 ? (
              blanks.map((blank: any, index: number) => (
                <TableRow key={blank.id}>
                  <TableCell>{meta.from + index}</TableCell>
                  <TableCell>{blank.number}</TableCell>
                  <TableCell className="space-x-2">
                    <Show when={blank.is_picked}>
                      <Badge className="text-white bg-gray-400">Dipakai Pengajuan</Badge>
                    </Show>
                    <Show when={blank.is_used}>
                      <Badge className="text-white bg-yellow-400">Sudah digunakan</Badge>
                    </Show>
                    <Show when={!blank.is_used}>
                      <Badge className="text-white bg-blue-400">Belum digunakan</Badge>
                    </Show>
                    <Show when={blank.is_broken}>
                      <Badge className="text-white bg-red-400">Rusak</Badge>
                    </Show>
                    <Show when={!blank.is_broken}>
                      <Badge className="text-white bg-green-400">Baik</Badge>
                    </Show>
                    <Show when={blank.profile_id}>
                      <Badge className="text-white bg-blue-500">Di {blank.profile?.name}</Badge>
                    </Show>
                  </TableCell>
                  <TableCell>{blank.created_at}</TableCell>
                  <TableCell className="text-right">
                    <Show when={blank.is_used || blank.profile_id == null}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                            <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-36 mr-8 mt-1">
                          <DropdownMenuItem className="p-0 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                            <AlertDialog open={openEdit} onOpenChange={setOpenEdit}>
                              <AlertDialogTrigger
                                className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-amber-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start"
                                onClick={() =>
                                  setDataForm({
                                    id: blank.id,
                                    number: blank.number,
                                  })
                                }>
                                Ubah Blangko
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Edit Blangko</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tindakan ini akan mengubah data Blangko
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <form onSubmit={(e) => updateBlangko(e)} className="mt-6 space-y-6">
                                  <div>
                                    <Label htmlFor="number">Nomor Blangko</Label>
                                    <Input
                                      id="number"
                                      value={dataForm.number}
                                      onChange={(e) =>
                                        setDataForm({
                                          ...dataForm,
                                          number: e.target.value,
                                        })
                                      }
                                      type="text"
                                      className="mt-1 block w-full"
                                    />

                                    {(errors?.number?.length ?? 0) > 0 &&
                                      errors?.number?.map((error: string, index: number) => (
                                        <InputError key={index} message={error} />
                                      ))}
                                  </div>

                                  <div className="flex justify-end gap-x-3">
                                    <AlertDialogCancel onClick={() => setOpenEdit(false)}>Batal</AlertDialogCancel>
                                    <Button type={"submit"} disabled={isLoading}>
                                      Simpan <Loading isLoading={isLoading} />
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
                                    Tindakan ini akan menghapus data blangko?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => {
                                      deleteData(blank);
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
                    </Show>
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

export default BlankPage;

BlankPage.layout = (page: any) => {
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
