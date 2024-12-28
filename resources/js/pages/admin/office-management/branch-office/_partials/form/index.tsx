import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import Label from "@/components/common/input-label";
import InputLocation from "@/components/common/input-location";
import RenderList from "@/components/common/render-list";
import Input from "@/components/common/text-input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useGetAllBranchGuarantor from "@/hooks/api/guarantor/useGetAllBranchGuarantor";
import useGetAllGuarantor from "@/hooks/api/guarantor/useGetAllGuarantor";
import useGetAllProvince from "@/hooks/api/locations/useGetAllProvince";
import useGetDistrictByRegencyId from "@/hooks/api/locations/useGetDistrictByRegencyId";
import useGetRegencyByProvinceId from "@/hooks/api/locations/useGetRegencyByProvinceId";
import { router, useForm } from "@inertiajs/react";
import React, { FormEventHandler, useCallback, useMemo, useState } from "react";

interface IBranchGuarantor {
  id: number | null;
  name: string | null;
}

interface IPairingGuarantor {
  id: number | null;
  name: string | null;
  branches: IBranchGuarantor[];
}

interface Props {
  branchOffice?: any;
  routeSubmit: string;
  routeBack: string;
  type?: "cabang" | "mitra-pemasaran" | "mitra-agen";
}

const Form: React.FC<Props> = ({ branchOffice, routeSubmit, routeBack, type }) => {
  const { data, setData, post, patch, errors, processing } = useForm({
    id: branchOffice?.id ?? null,
    code: branchOffice?.code ?? "",
    name: branchOffice?.name ?? "",
    email: branchOffice?.email ?? "",
    phone: branchOffice?.phone ?? "",
    province_id: branchOffice?.province_id ?? null,
    regency_id: branchOffice?.regency_id ?? null,
    district_id: branchOffice?.district_id ?? null,
    village: branchOffice?.village ?? "",
    address: branchOffice?.address ?? "",
    postal_code: branchOffice?.postal_code ?? "",
    pairingGuarantor: branchOffice?.pairingGuarantor ?? [],
    office_type: "branch",
  });

  const { provinces: jobLocationProvinces } = useGetAllProvince();
  const { regencies: jobLocationRegencies } = useGetRegencyByProvinceId({
    province_id: data?.province_id,
  });
  const { districts: jobLocationDistricts } = useGetDistrictByRegencyId({
    regency_id: data?.regency_id,
  });

  const { guarantors, loading: loadingGetGuarantor } = useGetAllGuarantor();
  const { branchGuarantors, loading: loadingGetBranchGuarantor } = useGetAllBranchGuarantor();
  const [pairingGuarantor, setPairingGuarantor] = useState<IPairingGuarantor[] | null>([
    {
      id: null,
      name: null,
      branches: [],
    },
  ]);

  const availableGuarantors = useMemo(() => {
    if (!loadingGetGuarantor) {
      return guarantors.map((guarantor: any) => ({
        ...guarantor,
        isChoosed: (pairingGuarantor ?? []).some((pairing) => pairing.id === guarantor.id),
      }));
    }

    return [];
  }, [pairingGuarantor, loadingGetGuarantor]);

  const limitCreateGuarantor = pairingGuarantor?.length === availableGuarantors.length;

  const handleAvailableBranchGuarantors = useCallback(
    (guarantoId: any) => {
      if (!loadingGetGuarantor && !loadingGetBranchGuarantor) {
        const filteredBranchGuarantors = branchGuarantors.filter(
          (branch: any) => branch?.headquarter_id === guarantoId,
        );

        return filteredBranchGuarantors.map((branch: any) => ({
          ...branch,
          isChoosed: (pairingGuarantor ?? []).some(
            (pairing) => pairing.branches?.some((pairingBranch) => pairingBranch.id === branch.id) ?? false,
          ),
        }));
      }

      return [];
    },
    [loadingGetGuarantor, loadingGetBranchGuarantor, pairingGuarantor],
  );

  // Add a new guarantor
  const addGuarantor = () => {
    if (limitCreateGuarantor) {
      return;
    }
    setPairingGuarantor((prev) => [
      ...(prev || []),
      {
        id: null,
        name: null,
        branches: [], // Track branches per guarantor
      },
    ]);
  };

  // Update selected guarantor
  const updateGuarantor = (index: number, selectedGuarantor: any) => {
    const updatedGuarantorData =
      pairingGuarantor?.map((gr, idx) =>
        idx === index
          ? {
              ...gr,
              id: selectedGuarantor.id,
              name: selectedGuarantor.name,
              branches: [], // Reset branches
            }
          : gr,
      ) || [];

    setData("pairingGuarantor", updatedGuarantorData);
    setPairingGuarantor(updatedGuarantorData);
  };

  // Delete a guarantor
  const deleteGuarantor = (index: number) => {
    const updatedData = pairingGuarantor?.filter((_, idx) => idx !== index) || [];

    setData("pairingGuarantor", updatedData);
    setPairingGuarantor(updatedData);
  };

  const addBranch = (index: number) => {
    const updatedBranch =
      pairingGuarantor?.map((gr, idx) =>
        idx === index
          ? {
              ...gr,
              branches: [...(gr.branches || []), { id: null, name: null }],
            }
          : gr,
      ) || [];
    setPairingGuarantor(updatedBranch);
  };

  const updateBranch = (guarantorIndex: number, branchIndex: number, selectedBranch: any) => {
    const updatedBranch =
      pairingGuarantor?.map((gr, idx) =>
        idx === guarantorIndex
          ? {
              ...gr,
              branches: gr.branches.map((branch, bIdx) =>
                bIdx === branchIndex ? { id: selectedBranch.id, name: selectedBranch.name } : branch,
              ),
            }
          : gr,
      ) || [];

    setData("pairingGuarantor", updatedBranch);
    setPairingGuarantor(updatedBranch);
  };

  // Delete a branch from a specific guarantor
  const deleteBranch = (guarantorIndex: number, branchIndex: number) => {
    const updatedBranch =
      pairingGuarantor?.map((gr, idx) =>
        idx === guarantorIndex
          ? {
              ...gr,
              branches: gr.branches.filter((_, bIdx) => bIdx !== branchIndex),
            }
          : gr,
      ) || [];

    setData("pairingGuarantor", updatedBranch);
    setPairingGuarantor(updatedBranch);
  };

  const cancel = () => {
    router.get(routeBack);
  };

  const submit: FormEventHandler<HTMLFormElement> = (event: any) => {
    event.preventDefault();

    if (data.id) {
      patch(routeSubmit, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => {
          router.get(routeBack);
        },
      });
    } else {
      post(routeSubmit, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => {
          router.get(routeBack);
        },
      });
    }
  };

  console.log({
    data,
  });

  return (
    <form onSubmit={submit} className="mt-6 space-y-10">
      <div className="grid gap-1 ">
        <p className="text-xl font-bold">Data Kantor Cabang</p>
        <div className="grid gap-5 mt-2">
          <div className="flex gap-5">
            <div className="w-1/2 space-y-1">
              <Label htmlFor="code" value="Kode Cabang" />
              <Input
                id="code"
                value={data.code}
                onChange={(e) => setData("code", e.target.value)}
                required
                autoComplete="code"
                placeholder="Masukan Kode Cabang"
              />
              <InputError className="mt-2" message={errors.code} />
            </div>

            <div className="w-1/2 space-y-1">
              <Label htmlFor="name" value="Nama" />
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                required
                autoComplete="name"
                placeholder="Masukan Nama Cabang"
              />
              <InputError className="mt-2" message={errors.name} />
            </div>
          </div>
          <div className="flex gap-5">
            <div className="w-1/2 space-y-1">
              <Label htmlFor="email" value="Email" />
              <Input
                id="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                autoComplete="email"
                placeholder="Masukan Email Cabang"
              />

              <InputError className="mt-2" message={errors.email} />
            </div>

            <div className="w-1/2 space-y-1">
              <Label htmlFor="phone" value="Telepon" />
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                required
                autoComplete="phone"
                placeholder="Masukan Nomor Telepon Cabang"
              />
              <InputError className="mt-2" message={errors.phone} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-1 ">
        <p className="text-xl font-bold">Lokasi Kantor Cabang</p>
        <div className="grid gap-5 mt-2">
          <div className="flex gap-5">
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Provinsi</Label>
              <Combobox
                datas={jobLocationProvinces}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Provinsi"
                defaultValueId={data?.province_id}
                onSelect={(val: any) => {
                  setData("province_id", val.id);
                }}
              />
            </div>
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Kabupaten/Kota</Label>
              <Combobox
                datas={jobLocationRegencies}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Kabupaten/Kota"
                defaultValueId={data?.regency_id}
                onSelect={(val: any) => {
                  setData("regency_id", val.id);
                }}
              />
            </div>
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Kecamatan</Label>
              <Combobox
                datas={jobLocationDistricts}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Kecamatan"
                defaultValueId={data?.district_id}
                onSelect={(val: any) => {
                  setData("district_id", val.id);
                }}
              />
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Desa</Label>
              <Input
                className="text-md"
                placeholder="Masukan nama Desa"
                value={data.village}
                onChange={(e) => {
                  setData("village", e.currentTarget.value);
                }}
              />
            </div>
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Alamat Lengkap</Label>
              <Textarea
                className="text-md"
                placeholder="Masukan Jalan/RT/RW dsb."
                value={data?.address}
                onChange={(e) => {
                  setData("address", e.currentTarget.value);
                }}
              />
            </div>
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Kode Pos</Label>
              <Input
                className="text-md"
                placeholder="Masukan nama Desa"
                value={data.postal_code}
                onChange={(e) => {
                  setData("postal_code", e.currentTarget.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className=" space-y-8 ">
        <h1 className="text-xl font-bold">Pairing Asuransi</h1>
        <div className="space-y-10">
          <RenderList
            of={pairingGuarantor || []}
            render={(guarantor, guarantorIndex) => {
              const filteredBranchGuarantors = handleAvailableBranchGuarantors(guarantor.id);
              const isCanAddBranch = (guarantor.branches ?? []).length < filteredBranchGuarantors.length;

              return (
                <div key={guarantorIndex + 1} className="space-y-4">
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Label>Asuransi</Label>
                      <Combobox
                        datas={availableGuarantors}
                        labelKey="name"
                        valueKey="name"
                        placeholder="Pilih Asuransi"
                        defaultValueId={guarantor.id}
                        checkedWithCondition={true}
                        notFoundText="Asuransi tidak ditemukan!"
                        onSelect={(val) => updateGuarantor(guarantorIndex, val)}
                      />
                    </div>
                    <div>
                      <Label>Cabang Asuransi</Label>
                      <div className="space-y-2">
                        <RenderList
                          of={guarantor.branches || []}
                          render={(branch, branchIndex) => (
                            <div key={branchIndex} className="flex items-center gap-2">
                              <Combobox
                                datas={filteredBranchGuarantors}
                                labelKey="name"
                                valueKey="name"
                                placeholder="Pilih Cabang Asuransi"
                                notFoundText="Cabang Asuransi tidak ditemukan!"
                                checkedWithCondition={true}
                                defaultValueId={branch.id}
                                onSelect={(val) => updateBranch(guarantorIndex, branchIndex, val)}
                              />
                              <Button
                                type="button"
                                variant={"destructive"}
                                onClick={() => deleteBranch(guarantorIndex, branchIndex)}>
                                Hapus Cabang
                              </Button>
                            </div>
                          )}
                        />
                      </div>
                      <Button
                        disabled={!isCanAddBranch}
                        type="button"
                        className="mt-2 w-full"
                        onClick={() => addBranch(guarantorIndex)}>
                        {filteredBranchGuarantors.length === 0
                          ? "Cabang belum ada!"
                          : isCanAddBranch
                            ? "Tambah Cabang Asuransi"
                            : "Mencapai Maksimum Cabang Asuransi tersedia!"}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant={"destructive"}
                    className="w-full"
                    onClick={() => deleteGuarantor(guarantorIndex)}>
                    Hapus Asuransi
                  </Button>
                </div>
              );
            }}
          />
          <Button
            disabled={limitCreateGuarantor}
            className="w-full"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addGuarantor();
            }}>
            {limitCreateGuarantor ? "Mencapai Maksimum Asuransi yang Ada!" : "Tambah Asuransi"}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 justify-end">
        <Button variant={"destructive"} onClick={cancel}>
          Batal
        </Button>

        <Button disabled={processing}>Simpan</Button>
      </div>
    </form>
  );
};

export default Form;
