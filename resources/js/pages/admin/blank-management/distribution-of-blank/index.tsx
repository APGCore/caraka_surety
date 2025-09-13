import { toast } from "@/common/hooks/general/use-toast";
import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { Alert, AlertDescription, AlertTitle } from "@/components/_shadcn-ui/alert";
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
import { Checkbox } from "@/components/_shadcn-ui/checkbox";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_shadcn-ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { Combobox } from "@/components/molecules/combobox";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { DistributionBlankPageProps } from "@/pages/admin/blank-management/distribution-of-blank/distribution-of-blank-page.type";
import { DistributionOfBlankUtils } from "@/pages/admin/blank-management/distribution-of-blank/distribution-of-blank.utils";
import { Head, router } from "@inertiajs/react";
import axios from "axios";
import { pickBy } from "lodash";
import { ArrowDown, ArrowRight } from "lucide-react";
import React, { useState } from "react";

interface blank {
  id: number;
  number: string;
}

const DistributionBlank: DistributionBlankPageProps = ({
  guarantors,
  guarantorBranches,
  guarantorSelected,
  guarantorBranchSelected,
  offices,
  officeTypes,
  officeSelected,
  officeTypeSelected,
  picked = "all",
  ...props
}) => {
  const { data: blanks, meta } = props.blanks;

  const [select, setSelect] = useState(() =>
    getQueryParameter("per_page") ? Number(getQueryParameter("per_page")) : 10,
  );
  const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");
  const [isAddBlank, setIsAddBlank] = useState<boolean>(false);
  const [blankNotUsed, setBlankNotUsed] = useState<Array<blank>>([]);
  const [selectedBlanks, setSelectedBlanks] = useState<Array<blank>>([]);
  const [selectedFirstBlank, setSelectedFirstBlank] = useState<blank | null>(null);
  const [qtyBlank, setQtyBlank] = useState<number>(0);
  const [selectedLastBlank, setSelectedLastBlank] = useState<blank | null>(null);
  const [selectedFirstBlankTransfer, setSelectedFirstBlankTransfer] = useState<blank | null>(null);
  const [qtyBlankTransfer, setQtyBlankTransfer] = useState<number>(0);
  const [selectedLastBlankTransfer, setSelectedLastBlankTransfer] = useState<blank | null>(null);
  const [officeForTransfer, setOfficeForTransfer] = useState<Array<any>>([]);
  const [fromOffice, setFromOffice] = useState<any | null>(null);
  const [toOffice, setToOffice] = useState<any | null>(null);
  const [targetGuarantorBranch, setTargetGuarantorBranch] = useState(null);

  const handleSelect = (e: string) => {
    setSelect(Number(e));
    refresh({
      perPage: e,
    });
  };

  const handleSearchNew = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refresh();
  };

  const handleAddBlank = (isAddBlankSelect: boolean) => {
    setIsAddBlank(isAddBlankSelect);
    refresh({ isAddBlankSelect });
  };

  const fetchBlankDistributed = async (office: any) => {
    const data = await axios.get(route(DistributionOfBlankUtils.link.getBlankDistributed), {
      params: { guarantor_id: guarantorSelected, profile_id: office.id },
    });
    return data.data;
  };

  const fetchBlankRange = async () => {
    const data = await axios.get(
      route(DistributionOfBlankUtils.link.getBlankRange, {
        guarantor_id: guarantorSelected,
      }),
    );
    return data.data;
  };

  const fetchBlankUnused = async (guarantorBranchId: number) => {
    const data = await axios.get(
      route(DistributionOfBlankUtils.link.getBlankUnused, {
        guarantor_id: guarantorSelected,
        guarantor_branch_id: guarantorBranchId,
      }),
    );
    return data.data;
  };

  const handleAddBlankCustom = async () => {
    const dataBlankNotUsed = await fetchBlankRange();
    setBlankNotUsed(dataBlankNotUsed.data);
    setSelectedFirstBlank(dataBlankNotUsed.data[0] ?? null);
  };

  const handleChangeRange = (range: number) => {
    setQtyBlank(range);
    const firstBlankIndex = blankNotUsed.findIndex((blank: any) => blank.number === selectedFirstBlank?.number) + 1;
    const blankNotUsedFiltered = blankNotUsed.slice(firstBlankIndex ? firstBlankIndex - 1 : 0);
    setSelectedBlanks(blankNotUsedFiltered.slice(0, range));
    if (range == 0) {
      setSelectedLastBlank(null);
    } else {
      setSelectedLastBlank(blankNotUsedFiltered[range - 1]);
    }
  };

  const changeFromOffice = async (office: any) => {
    setFromOffice(office);
    const { data } = await fetchBlankDistributed(office);

    setBlankNotUsed(data);
    setSelectedFirstBlankTransfer(data[0] ?? null);
  };

  const changeGuarantorBranch = async (guarantorBranchId: number) => {
    const { data } = await fetchBlankUnused(guarantorBranchId);
    setBlankNotUsed(data);
    setSelectedFirstBlank(data[0] ?? null);
  };

  const addBlank = () => {
    if (selectedBlanks.length === 0) {
      return toast({
        title: "Gagal",
        description: "Pilih blangko terlebih dahulu",
        variant: "destructive",
      });
    }
    const blankSend = selectedBlanks.map((blank) => {
      return blank.id;
    });
    router.post(
      route(DistributionOfBlankUtils.link.store),
      {
        blank_ids: blankSend,
        office_id: officeSelected,
      },
      {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          handleAddBlank(false);
          setSelectedBlanks([]);
          setBlankNotUsed([]);
          setQtyBlank(0);
          setSelectedFirstBlank(null);
          setSelectedLastBlank(null);
        },
      },
    );
  };

  const handleTransfer = async () => {
    const response = await axios.get(route(DistributionOfBlankUtils.link.getOffice));
    setOfficeForTransfer(response.data.data);
  };

  const transferBlank = () => {
    if (fromOffice === null || toOffice === null) {
      return toast({
        title: "Gagal",
        description: "Pilih kantor asal dan tujuan terlebih dahulu",
        variant: "destructive",
      });
    }
    if (selectedBlanks.length === 0) {
      return toast({
        title: "Gagal",
        description: "Pilih blangko terlebih dahulu",
        variant: "destructive",
      });
    }
    const blankSend = selectedBlanks.map((blank) => {
      return blank.id;
    });
    const data = {
      blank_ids: blankSend,
      office_id: toOffice.id,
      from_office_id: fromOffice.id,
    };
    router.post(route(DistributionOfBlankUtils.link.storeTransfer), data, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => clearFormTransfer(),
    });
  };

  const handleChangeGuarantorBranch = async () => {
    if (targetGuarantorBranch === null) {
      return toast({
        title: "Gagal",
        description: "Pilih cabang asuransi tujuan terlebih dahulu",
        variant: "destructive",
      });
    }
    if (blankNotUsed.length === 0) {
      return toast({
        title: "Gagal",
        description: "Tidak ada blangko untuk di transfer",
        variant: "destructive",
      });
    }
    const blankChange = selectedBlanks.map((blank) => {
      return blank.id;
    });
    const data = {
      guarantor_branch_id: targetGuarantorBranch,
      blank_ids: blankChange,
    };
    router.post(route(DistributionOfBlankUtils.link.changeGuarantorBranch), data, {
      preserveState: true,
      preserveScroll: true,
      onSuccess: () => {
        setQtyBlank(0);
        setBlankNotUsed([]);
        setSelectedFirstBlank(null);
        setSelectedLastBlank(null);
        setTargetGuarantorBranch(null);
        refresh();
      },
    });
  };

  const refresh = (data?: {
    perPage?: string;
    search?: string;
    guarantorId?: number | null;
    guarantorBranchId?: number | null;
    officeType?: string | null;
    officeId?: number | null;
    isAddBlankSelect?: boolean | null;
    picked?: string | null;
  }) => {
    return router.get(
      route(DistributionOfBlankUtils.link.index),
      pickBy({
        per_page: data?.perPage === null ? null : (data?.perPage ?? String(select)),
        search: data?.search === null ? null : (data?.search ?? String(search)),
        guarantor_id: data?.guarantorId === null ? null : (data?.guarantorId ?? guarantorSelected),
        guarantor_branch_id:
          data?.guarantorBranchId === null ? null : (data?.guarantorBranchId ?? guarantorBranchSelected),
        office_type: data?.officeType === null ? null : (data?.officeType ?? officeTypeSelected),
        office_id: data?.officeId === null ? null : (data?.officeId ?? officeSelected),
        is_add_blank: data?.isAddBlankSelect === null ? null : (data?.isAddBlankSelect ?? isAddBlank),
        picked: data?.picked === null ? null : (data?.picked ?? picked),
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const clearFormTransfer = () => {
    handleAddBlank(false);
    setSelectedBlanks([]);
    setBlankNotUsed([]);
    setQtyBlankTransfer(0);
    setSelectedFirstBlankTransfer(null);
    setSelectedLastBlankTransfer(null);
    setFromOffice(null);
    setToOffice(null);
  };

  const deleteData = (distributionOfBlank: any) => {
    router.delete(route(DistributionOfBlankUtils.link.destroy, distributionOfBlank.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Daftar Blangko</h1>
        <div className="flex w-[30%] gap-x-3 justify-end">
          {!isAddBlank && (
            <>
              <AlertDialog>
                <AlertDialogTrigger
                  className="bg-yellow text-destructive-foreground shadow-sm hover:bg-yellow/90
                                    px-2 py-1.5 text-sm w-full rounded-sm text-start"
                  onClick={() => changeGuarantorBranch(guarantorBranchSelected)}
                  asChild>
                  <Button size="sm" className="bg-yellow-800 hover:bg-yellow-700">
                    Ubah Cabang Asuransi
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="w-max">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Ubah Cabang Asuransi Blangko</AlertDialogTitle>
                    <AlertDialogDescription>Silakan masukan jumlah blangko yang akan di bagikan</AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex items-center gap-2">Blangko Tersedia: {blankNotUsed.length}</div>
                  <div className="flex items-end justify-around mt-6 space-x-2">
                    <div>
                      <Label htmlFor="number">Nomor Blangko Pertama</Label>
                      <Combobox
                        datas={blankNotUsed}
                        labelKey={"number"}
                        valueKey={"id"}
                        defaultValue={selectedFirstBlank?.id ?? ""}
                        onSelect={(e) => {
                          const selectedBlank = blankNotUsed.find((blank) => blank.number === e.number);
                          setSelectedFirstBlank(selectedBlank ?? null);
                          setSelectedLastBlank(null);
                          setQtyBlank(0);
                        }}
                      />
                    </div>
                    <ArrowRight className="mb-2" />
                    <div>
                      <Label htmlFor="qty_blangko">jumlah</Label>
                      <Input
                        id="qty_blangko"
                        value={qtyBlank}
                        onChange={async (e: any) => {
                          const qty = Number(e.target.value);
                          handleChangeRange(qty);
                        }}
                        type="number"
                        min="0"
                        max={blankNotUsed.length}
                        className="mt-1 block w-full"
                      />
                    </div>
                    <ArrowRight className="mb-2" />
                    <div>
                      <Label htmlFor="number">Nomor Blangko Terakhir</Label>
                      <Input
                        id="number"
                        value={selectedLastBlank?.number ?? ""}
                        type="text"
                        className="mt-1 block w-full"
                        disabled
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="number">Cabang Asuransi</Label>
                    <Combobox
                      datas={guarantorBranches}
                      labelKey={"name"}
                      valueKey={"name"}
                      defaultValue={guarantorBranchSelected}
                      placeholder={"Pilih Cabang Asuransi"}
                      className={"max-w-[100%]"}
                      disabledValue={true}
                    />
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowDown />
                  </div>
                  <div>
                    <Label htmlFor="number">Cabang Asuransi</Label>
                    <Combobox
                      datas={guarantorBranches}
                      labelKey={"name"}
                      valueKey={"name"}
                      placeholder={"Pilih Cabang Asuransi"}
                      className={"max-w-[100%]"}
                      onSelect={(value) => setTargetGuarantorBranch(value.id)}
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => {
                        setQtyBlank(0);
                        setBlankNotUsed([]);
                        setSelectedFirstBlank(null);
                        setSelectedLastBlank(null);
                        setTargetGuarantorBranch(null);
                      }}>
                      Batal
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleChangeGuarantorBranch}>Ubah</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger
                  className="bg-primary text-destructive-foreground shadow-sm hover:bg-primary/90
                                    px-2 py-1.5 text-sm w-full rounded-sm text-start"
                  onClick={() => handleAddBlankCustom()}
                  asChild>
                  <Button size="sm" className="bg-green-800 hover:bg-green-700">
                    Bagikan Blangko
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={"w-max"}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Pembagian Blangko</AlertDialogTitle>
                    <AlertDialogDescription>Silakan masukan jumlah blangko yang akan di bagikan</AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex items-center gap-2">Blangko Tersedia: {blankNotUsed.length}</div>
                  <div className="flex items-end justify-around mt-6 space-x-2">
                    <div>
                      <Label htmlFor="number">Nomor Blangko Pertama</Label>
                      <Input
                        id="number"
                        value={selectedFirstBlank?.number ?? ""}
                        type="text"
                        className="mt-1 block w-full"
                        disabled
                      />
                    </div>
                    <ArrowRight className="mb-2" />
                    <div>
                      <Label htmlFor="qty_blangko">jumlah</Label>
                      <Input
                        id="qty_blangko"
                        value={qtyBlank}
                        onChange={async (e: any) => {
                          const qty = Number(e.target.value);
                          handleChangeRange(qty);
                        }}
                        type="number"
                        min="0"
                        max={blankNotUsed.length}
                        className="mt-1 block w-full"
                      />
                    </div>
                    <ArrowRight className="mb-2" />
                    <div>
                      <Label htmlFor="number">Nomor Blangko Terakhir</Label>
                      <Input
                        id="number"
                        value={selectedLastBlank?.number ?? ""}
                        type="text"
                        className="mt-1 block w-full"
                        disabled
                      />
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel
                      onClick={() => {
                        setQtyBlank(0);
                        setBlankNotUsed([]);
                        setSelectedFirstBlank(null);
                        setSelectedLastBlank(null);
                      }}>
                      Batal
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={addBlank}>Bagikan</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger
                  className="bg-primary text-destructive-foreground shadow-sm hover:bg-primary/90
                                    px-2 py-1.5 text-sm w-full rounded-sm text-start"
                  onClick={() => {
                    setQtyBlankTransfer(0);
                    setSelectedFirstBlankTransfer(null);
                    setSelectedLastBlankTransfer(null);
                  }}
                  asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-500" onClick={handleTransfer}>
                    Transfer Blangko
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className={"w-max"}>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Transfer Blangko</AlertDialogTitle>
                    <AlertDialogDescription>
                      Silakan masukan jumlah blangko yang akan di transfer
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">Blangko Tersedia: {blankNotUsed.length}</div>
                    <div className="flex items-end justify-around mt-6 space-x-2">
                      <Combobox
                        datas={officeForTransfer}
                        labelKey={"name"}
                        valueKey={"name"}
                        defaultValueId={fromOffice?.id}
                        placeholder={"Pilih Kantor Asal"}
                        className={"w-[210px]"}
                        onSelect={(value) => changeFromOffice(value)}
                      />
                      <ArrowRight className="mb-2" />
                      <Combobox
                        datas={officeForTransfer.filter((office: any) => office.id !== fromOffice?.id)}
                        labelKey={"name"}
                        valueKey={"name"}
                        defaultValueId={toOffice?.id}
                        placeholder={"Pilih Kantor Tujuan"}
                        className={"w-[210px]"}
                        onSelect={(value) => setToOffice(value)}
                      />
                    </div>
                    <div className="flex items-end justify-around mt-6 space-x-2">
                      <div>
                        <Label htmlFor="number">Nomor Blangko Pertama</Label>
                        <Combobox
                          datas={blankNotUsed}
                          labelKey={"number"}
                          valueKey={"id"}
                          defaultValue={selectedFirstBlankTransfer?.id ?? ""}
                          onSelect={(e) => {
                            const selectedBlank = blankNotUsed.find((blank) => blank.number === e.number);
                            setSelectedFirstBlankTransfer(selectedBlank ?? null);
                            setSelectedLastBlankTransfer(null);
                            setQtyBlankTransfer(0);
                          }}
                        />
                      </div>
                      <ArrowRight className="mb-2" />
                      <div>
                        <Label htmlFor="qty_blangko">jumlah</Label>
                        <Input
                          id="qty_blangko"
                          value={qtyBlankTransfer}
                          onChange={(e: any) => {
                            const qty = Number(e.target.value);
                            setQtyBlankTransfer(qty);
                            const firstBlankIndex =
                              blankNotUsed.findIndex(
                                (blank: any) => blank.number === selectedFirstBlankTransfer?.number,
                              ) + 1;
                            const blankNotUsedFiltered = blankNotUsed.slice(firstBlankIndex ? firstBlankIndex - 1 : 0);
                            setSelectedBlanks(blankNotUsedFiltered.slice(0, qty));
                            if (qty == 0) {
                              setSelectedLastBlankTransfer(null);
                            } else {
                              setSelectedLastBlankTransfer(blankNotUsedFiltered[qty - 1]);
                            }
                          }}
                          type="number"
                          min="0"
                          max={
                            blankNotUsed.length -
                            blankNotUsed.findIndex((blank: any) => blank.number === selectedFirstBlankTransfer?.number)
                          }
                          className="mt-1 block w-full"
                        />
                      </div>
                      <ArrowRight className="mb-2" />
                      <div>
                        <Label htmlFor="number">Nomor Blangko Terakhir</Label>
                        <Input
                          id="number"
                          value={selectedLastBlankTransfer?.number ?? ""}
                          type="text"
                          className="mt-1 block w-full"
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => clearFormTransfer()}>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={transferBlank}>Transfer</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
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
        </div>
        <div className="flex gap-x-3">
          <form onSubmit={(e) => handleSearchNew(e)} className="flex items-end gap-x-3">
            <Input placeholder="Cari Blangko" value={search} onChange={(e) => setSearch(e.target.value)} />
            <Button type="submit">Cari</Button>
          </form>
        </div>
      </div>

      <div className="flex gap-x-3">
        <Select onValueChange={(value) => refresh({ picked: value })} defaultValue={String(picked)}>
          <SelectTrigger className="w-[15%]">
            <SelectValue placeholder="Pilih " />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={"all"}>Semua</SelectItem>
              <SelectItem value={"true"}>Sudah Dipakai</SelectItem>
              <SelectItem value={"false"}>Belum Dipakai</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Combobox
          datas={guarantors}
          labelKey={"name"}
          valueKey={"name"}
          defaultValue={guarantorSelected}
          placeholder={"Pilih Asuransi"}
          className={"w-[210px]"}
          onSelect={(value) => refresh({ guarantorId: value.id, guarantorBranchId: null, officeId: null })}
        />
        <Combobox
          datas={guarantorBranches}
          labelKey={"name"}
          valueKey={"name"}
          defaultValue={guarantorBranchSelected}
          placeholder={"Pilih Cabang Asuransi"}
          // className={"w-[310px]"}
          onSelect={(value) => refresh({ guarantorBranchId: value.id })}
        />
        <Select
          onValueChange={(value) => refresh({ officeType: value, officeId: null })}
          defaultValue={String(officeTypeSelected)}>
          <SelectTrigger className="w-[15%]">
            <SelectValue placeholder="Pilih " />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <RenderList
                of={officeTypes}
                render={(officeType: string) => <SelectItem value={officeType}>{officeType}</SelectItem>}
              />
            </SelectGroup>
          </SelectContent>
        </Select>
        <Show when={officeTypeSelected !== officeTypes[0]}>
          <Combobox
            datas={offices}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={officeSelected}
            placeholder={"Pilih Kantor"}
            className={"w-[210px]"}
            onSelect={(value) => refresh({ officeId: value.id })}
          />
        </Show>
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
              <TableHead>Status</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-right" />
            </TableRow>
          </TableHeader>
          <TableBody>
            <Show when={blanks.length > 0}>
              <RenderList
                of={blanks}
                render={(blank: any, index: number) => {
                  return (
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
                      <TableCell className="space-x-1">
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
                        <Show when={blank.is_approved}>
                          <Badge className="text-white bg-green-400">Sudah Diterima</Badge>
                        </Show>
                        <Show when={!blank.is_approved}>
                          <Badge className="text-white bg-yellow-400">Belum Diterima</Badge>
                        </Show>
                        <Show when={blank.from_profile_id}>
                          <Badge className="text-white bg-blue-400">Di Transfer Dari {blank.from_profile?.name}</Badge>
                        </Show>
                      </TableCell>
                      <TableCell>{blank.created_at}</TableCell>
                      <Show when={!blank.is_picked}>
                        <TableCell className="text-right">
                          <AlertDialog>
                            <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm rounded-sm text-start">
                              Delete
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Apakah Anda benar-benar yakin?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tindakan ini akan menghapus data blangko dari {blank?.profile?.name}?
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
                        </TableCell>
                      </Show>
                    </TableRow>
                  );
                }}
              />
            </Show>
            <Show when={blanks.length < 0}>
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            </Show>
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
