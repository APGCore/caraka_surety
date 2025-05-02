import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import { Label } from "@/_features/_common/components/_shadcn-ui/label";
import { Textarea } from "@/_features/_common/components/_shadcn-ui/textarea";
import NewCombobox from "@/_features/_common/components/combobox";
import Loading from "@/_features/_common/components/loading";
import { useGetAllBranchGuarantor } from "@/_features/insurance/services/insurance-query";
import { useGetDistrictByRegencyId } from "@/_features/location/services/district-location-query";
import { useGetRegencyByProvinceId } from "@/_features/location/services/regency-location-query";
import { useGetAllProvince } from "@/common/hooks/react-query/location";
// import {
//   useGetAllProvince,
//   useGetDistrictByRegencyId,
//   useGetRegencyByProvinceId,
// } from "@/_features/location/services/location-query";
import { Button } from "@/components/_shadcn-ui/button";
import InputError from "@/components/molecules/input/error-input";
import { OfficeTypeEnum } from "@/types/office-type-enum";
import { router, useForm } from "@inertiajs/react";
import { FormEvent, useEffect, useMemo, useState } from "react";

interface BranchGuarantor {
  id: number;
  name: string;
}

interface OfficeFormProps {
  office?: any;
}

const OfficeForm = ({ office }: OfficeFormProps) => {
  const { data, setData, post, patch, errors, processing } = useForm({
    id: office?.id || null,
    code: office?.code || "",
    name: office?.name || "",
    email: office?.email || "",
    phone: office?.phone || "",
    province_id: office?.province_id || null,
    regency_id: office?.regency_id || null,
    district_id: office?.district_id || null,
    village: office?.village || "",
    address: office?.address || "",
    postal_code: office?.postal_code || "",
    pairing_guarantor: office?.pairing_guarantor || [],
    office_type: OfficeTypeEnum.BRANCH,
  });

  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvince();
  const { data: regencies, isLoading: isLoadingRegencies } = useGetRegencyByProvinceId(
    data?.province_id ? String(data?.province_id) : undefined,
  );
  const { data: districts, isLoading: isLoadingDistricts } = useGetDistrictByRegencyId(
    data?.regency_id ? String(data?.regency_id) : undefined,
  );

  const {
    data: branchGuarantors,
    isLoading: isLoadingBranchGuarantors,
    isSuccess: isSuccessBranchGuarantors,
  } = useGetAllBranchGuarantor();

  const [selectedBranchGuarantors, setSelectedBranchGuarantors] = useState<BranchGuarantor[]>([]);

  // Menyimpan data awal guarantor
  const guarantorsList = useMemo(() => {
    if (!isLoadingBranchGuarantors && Array.isArray(branchGuarantors)) {
      return branchGuarantors.map((guarantor: BranchGuarantor) => ({
        id: guarantor.id,
        name: guarantor.name,
        isChoosed: selectedBranchGuarantors.some((selected) => selected.id === guarantor.id),
      }));
    }
    return [];
  }, [branchGuarantors, isLoadingBranchGuarantors, selectedBranchGuarantors]);

  const handleSelectBranchGuarantor = (branchGuarantor: BranchGuarantor) => {
    if (!branchGuarantor) return;
    setData("pairing_guarantor", [...data.pairing_guarantor, branchGuarantor]);
    setSelectedBranchGuarantors([...selectedBranchGuarantors, branchGuarantor]);
  };

  // Render selected guarantors
  const renderSelectedGuarantors = useMemo(() => {
    return selectedBranchGuarantors.map((guarantor, index) => (
      <div key={guarantor.id} className="flex items-center justify-between p-1 text-sm pl-2 border rounded-md">
        <div className="flex items-center gap-2">
          <span className="font-medium">{guarantor.name}</span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            const newSelectedBranchGuarantors = selectedBranchGuarantors.filter((g) => g.id !== guarantor.id);

            setSelectedBranchGuarantors(newSelectedBranchGuarantors);
            setData("pairing_guarantor", newSelectedBranchGuarantors);
          }}>
          Hapus
        </Button>
      </div>
    ));
  }, [selectedBranchGuarantors]);

  useEffect(() => {
    if (office) {
      setSelectedBranchGuarantors(office.pairing_guarantor);
    }
  }, [office]);

  const handleBack = () => {
    router.get(route("branch.index"));
  };

  const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.id) {
      patch(route("branch.update", data.id), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          router.get(route("branch.index"));
        },
      });
    } else {
      post(route("branch.store"), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          router.get(route("branch.index"));
        },
      });
    }
  };

  return (
    <form className="mt-6 space-y-10" onSubmit={handleSubmitForm}>
      <div className="grid gap-1 ">
        <p className="text-lg font-bold uppercase underline underline-offset-4">Data Kantor Cabang BPR</p>
        <div className="grid gap-5 mt-5">
          <div className="flex gap-5">
            <div className="w-1/2 space-y-1">
              <Label htmlFor="code">Kode</Label>
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
              <Label htmlFor="name">Nama</Label>
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
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="phone">Telepon</Label>
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
        <p className="text-lg font-bold uppercase underline underline-offset-4">Lokasi Kantor Cabang BPR</p>
        <div className="grid gap-5 mt-5">
          <div className="flex gap-5">
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Provinsi</Label>
              <NewCombobox
                data={Array.isArray(provinces) ? provinces : []}
                valueKey="id"
                labelKey="name"
                isLoading={isLoadingProvinces}
                placeholder="Pilih Provinsi"
                defaultValue={data?.province_id}
                onSelect={(val: any) => {
                  setData({
                    ...data,
                    province_id: val.id,
                    regency_id: undefined,
                    district_id: undefined,
                  });
                }}
              />
            </div>
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Kabupaten/Kota</Label>
              <NewCombobox
                data={Array.isArray(regencies) ? regencies : []}
                valueKey="id"
                labelKey="name"
                isLoading={isLoadingRegencies}
                placeholder="Pilih Kabupaten/Kota"
                defaultValue={data?.regency_id}
                onSelect={(val: any) => {
                  setData({
                    ...data,
                    regency_id: val.id,
                    district_id: undefined,
                  });
                }}
              />
            </div>
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Kecamatan</Label>
              <NewCombobox
                data={Array.isArray(districts) ? districts : []}
                valueKey="id"
                labelKey="name"
                isLoading={isLoadingDistricts}
                placeholder="Pilih Kecamatan"
                defaultValue={data?.district_id}
                onSelect={(val: any) => {
                  setData({
                    ...data,
                    district_id: val.id,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Desa</Label>
              <Input
                className="text-md"
                placeholder="Masukan nama desa"
                value={data.village}
                onChange={(e) => {
                  setData("village", e.currentTarget.value);
                }}
              />
            </div>

            <div className="grid gap-1 w-full">
              <Label className="text-sm">Kode Pos</Label>
              <Input
                className="text-md"
                placeholder="Masukan kode pos"
                value={data.postal_code}
                onChange={(e) => {
                  setData("postal_code", e.currentTarget.value);
                }}
              />
            </div>
          </div>
          <div>
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
          </div>
        </div>
      </div>

      <div className="grid gap-1 ">
        <p className="text-lg font-bold uppercase underline underline-offset-4 mb-3">Pairing Asuransi</p>
        <NewCombobox
          isDisabled={
            !isLoadingBranchGuarantors &&
            Array.isArray(branchGuarantors) &&
            selectedBranchGuarantors.length === branchGuarantors?.length
          }
          data={guarantorsList}
          valueKey="id"
          labelKey="name"
          filterKey="isChoosed"
          isLoading={isLoadingBranchGuarantors}
          placeholder="Pilih Asuransi Pairing"
          onSelect={(val: any) => {
            handleSelectBranchGuarantor(val);
          }}
        />
        {selectedBranchGuarantors.length > 0 && (
          <div className="mt-4 space-y-2">
            <span className="text-sm font-bold">Asuransi yang dipilih</span>
            {renderSelectedGuarantors}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 justify-end">
        <Button variant={"destructive"} type="button" onClick={handleBack}>
          Batal
        </Button>
        <Button disabled={processing} type="submit">
          <Loading isLoading={processing} className="mr-1" /> Simpan
        </Button>
      </div>
    </form>
  );
};

export default OfficeForm;
