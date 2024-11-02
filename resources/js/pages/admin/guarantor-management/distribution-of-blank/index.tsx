import { Combobox } from "@/components/common/combobox";
import { PaginationDatatable } from "@/components/common/pagination-datatable";
import { ShowingCountDatatable } from "@/components/common/showing-count-datatable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/general/use-toast";
import AdminLayout from "@/layouts/admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import { DistributionBlankPageProps } from "@/pages/admin/guarantor-management/distribution-of-blank/distribution-of-blank-page.type";
import { Head, router } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import React, { useState } from "react";

const DistributionBlank: DistributionBlankPageProps = ({
  guarantors,
  guarantorSelected,
  offices,
  officeSelected,
  ...props
}) => {
  const { data: blanks, meta } = props.blanks;

  const [select, setSelect] = useState(() =>
    getQueryParameter("per_page") ? Number(getQueryParameter("per_page")) : 10,
  );
  const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");
  const [isAddBlank, setIsAddBlank] = useState<boolean>(false);
  const [selectedBlanks, setSelectedBlanks] = useState<
    Array<{
      id: number;
      number: string;
    }>
  >([]);

  const handleSelect = (e: string) => {
    setSelect(Number(e));
    getData(e, search, officeSelected);
  };

  const handleSearchNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search, officeSelected);
  };

  const handleAddBlank = (isAddBlankSelect: boolean) => {
    setIsAddBlank(isAddBlankSelect);
    getData(String(select), search, officeSelected, isAddBlankSelect);
  };

  const addBlank = () => {
    console.log(selectedBlanks);

    if (selectedBlanks.length === 0) {
      return toast({
        title: "Gagal",
        description: "Pilih blangko terlebih dahulu",
        variant: "destructive",
      });
    }
    router.post(
      route("distribution-of-blank.store"),
      {
        blanks: selectedBlanks,
        office_id: officeSelected,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setSelectedBlanks([]);
          handleAddBlank(false);
        },
      },
    );
  };

  const getData = (
    perPage: string,
    search: string | null,
    officeSelected: number,
    isAddBlankSelect: boolean = isAddBlank,
  ) => {
    return router.get(
      route("distribution-of-blank.index"),
      pickBy({
        per_page: perPage,
        guarantor_id: guarantorSelected,
        office_id: officeSelected,
        search: search,
        is_add_blank: isAddBlankSelect,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const setGuarantor = (guarantor: any) => {
    return router.get(
      route("distribution-of-blank.index"),
      pickBy({
        guarantor_id: guarantor.id,
        office_id: officeSelected,
        per_page: select,
        search: search,
        is_add_blank: isAddBlank,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const setOffice = (office: any) => {
    return router.get(
      route("distribution-of-blank.index"),
      pickBy({
        guarantor_id: guarantorSelected,
        office_id: office.id,
        per_page: select,
        search: search,
        is_add_blank: isAddBlank,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteData = (distributionOfBlank: any) => {
    router.delete(route("distribution-of-blank.destroy", distributionOfBlank.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Pembagian Blangko</h1>
        <div className="flex gap-x-3">
          {!isAddBlank && <Button onClick={() => handleAddBlank(true)}>Tambah Pembagian Blangko</Button>}
          {isAddBlank && (
            <>
              <Button onClick={() => handleAddBlank(false)} variant="destructive">
                Batal
              </Button>
              <Button className="bg-green-600 hover:bg-green-500" onClick={addBlank}>
                Tambah
              </Button>
            </>
          )}
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
          <Combobox
            datas={offices}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={officeSelected}
            placeholder={"Pilih Kantor"}
            className={"w-[210px]"}
            onSelect={(value) => setOffice(value)}
          />
        </div>
        <div className="flex gap-x-3">
          <form onSubmit={(e) => handleSearchNew(e)} className="flex items-end gap-x-3">
            <Input placeholder="Cari Blangko" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>

      {isAddBlank && (
        <div className="flex justify-between items-end">
          <Alert variant="warning">
            <AlertTitle>Pilih Blangko</AlertTitle>
            <AlertDescription>Pilih Blangko yang akan dibagikan</AlertDescription>
          </Alert>
        </div>
      )}

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              {isAddBlank && (
                <TableHead className="w-0">
                  <Checkbox
                    checked={selectedBlanks.length === blanks.length}
                    onCheckedChange={(value) => {
                      setSelectedBlanks(value ? blanks : []);
                    }}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              <TableHead className="w-0">#</TableHead>
              <TableHead>Nomor Blangko</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {blanks.length > 0 ? (
              blanks.map((blank: any, index: number) => (
                <TableRow key={blank.id}>
                  {isAddBlank && (
                    <TableCell>
                      <Checkbox
                        checked={selectedBlanks.some((item) => item.id === blank.id)}
                        onCheckedChange={(value) => {
                          if (value) {
                            setSelectedBlanks([...selectedBlanks, blank]);
                          } else {
                            setSelectedBlanks(selectedBlanks.filter((item) => item.id !== blank.id));
                          }
                        }}
                        aria-label={`Select row ${index + 1}`}
                      />
                    </TableCell>
                  )}
                  <TableCell>{meta.from + index}</TableCell>
                  <TableCell>{blank.number}</TableCell>
                  <TableCell>{blank.created_at}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                          <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-36 mr-8 mt-1">
                        {/*<DropdownMenuItem className="cursor-pointer p-0" onSelect={(e) => e.preventDefault()}>*/}
                        {/*  <Link*/}
                        {/*    href={route("distribution-of-blank.edit", blank.id) + "?office_id=" + officeSelected}*/}
                        {/*    className="bg-amber-500 text-destructive-foreground shadow-sm hover:bg-amber-500/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">*/}
                        {/*    Edit*/}
                        {/*  </Link>*/}
                        {/*</DropdownMenuItem>*/}
                        {/*<DropdownMenuSeparator />*/}
                        <DropdownMenuItem className="p-0 cursor-pointer" onSelect={(e) => e.preventDefault()}>
                          <AlertDialog>
                            <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                              Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini akan menghapus data karyawan {blank.name}?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    deleteData(blank);
                                  }}
                                  className={buttonVariants({ variant: "destructive" })}>
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
            )}
          </TableBody>
        </Table>
      </div>
      <ShowingCountDatatable meta={meta} />
      <PaginationDatatable meta={meta} />
    </main>
  );
};

export default DistributionBlank;

DistributionBlank.layout = (page: any) => {
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
