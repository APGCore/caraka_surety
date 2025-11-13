import { useForm } from "@inertiajs/react";
import { FormEvent, useEffect, useState } from "react";
import { DISTRICT_LOCATION_QUERY_KEY } from "@/_features/location/services/district-location-query";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import NewCombobox from "@/_features/_common/components/combobox";
import InputError from "@/components/molecules/input/error-input";
import InputLabel from "@/components/molecules/input/label-input";
import TextInput from "@/components/molecules/input/text-input";
import { Button } from "@/components/_shadcn-ui/button";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { useGetRegencyByProvinceId } from "@/_features/location/services/regency-location-query";
import { useGetAllProvince } from "@/_features/location/services/province-location-query";

interface CreateUpdateDistrictModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  district?: any;
}

const CreateUpdateDistrictModal = ({ open, handleOpen, district }: CreateUpdateDistrictModalProps) => {
  const { data, setData, errors, post, put, reset, processing } = useForm({
    id: "",
    regency_id: null,
    code: "",
    name: "",
  });
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(() => district?.regency?.province_id ?? null);
  console.log(district?.regency?.province_id, selectedProvinceId);

  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvince();
  const { data: regencies, isLoading: isLoadingRegencies } = useGetRegencyByProvinceId((selectedProvinceId ?? district?.regency?.province_id ?? "").toString());

  useEffect(() => {
    if (district && typeof district === "object") {
      setData({
        id: district.id,
        regency_id: district.regency_id,
        code: district.code,
        name: district.name,
      });
    }
  }, [district]);

  const createDistrict = () => {
    post(route("district.store"), {
      preserveState: true,
      preserveScroll: false,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [DISTRICT_LOCATION_QUERY_KEY.GET_ALL_DISTRICT],
            refetchType: "active",
          }),
          queryClient.invalidateQueries({
            queryKey: [DISTRICT_LOCATION_QUERY_KEY.GET_ALL_DISTRICT],
            refetchType: "active",
          }),
        ]);
        reset();
        handleOpen?.(false);
      },
    });
  };

  const updateDistrict = () => {
    put(
      route("district.update", {
        id: data.id,
      }),
      {
        preserveState: true,
        preserveScroll: false,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [DISTRICT_LOCATION_QUERY_KEY.SEARCH_DISTRICT],
              refetchType: "active",
            }),
            queryClient.invalidateQueries({
              queryKey: [DISTRICT_LOCATION_QUERY_KEY.GET_ALL_DISTRICT],
              refetchType: "active",
            }),
          ]);
          reset();
          handleOpen?.(false);
        },
      },
    );
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (district) {
      updateDistrict();
    } else {
      createDistrict();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{district ? "Memperbarui Kecamatan" : "Membuat Kecamatan"}</AlertDialogTitle>
          <AlertDialogDescription>
            {district ? "Tindakan ini akan memperbarui data kecamatan" : "Tindakan ini akan menambah data kecamatan"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
          <div>
            <InputLabel htmlFor="province_id" value="Pilih Provinsi" />
            <NewCombobox
              data={Array.isArray(provinces) ? provinces : []}
              valueKey="id"
              labelKey="name"
              isLoading={isLoadingProvinces}
              placeholder="Pilih Provinsi"
              defaultValue={selectedProvinceId ?? district?.regency?.province_id ?? undefined}
              onSelect={(val: any) => {
                setSelectedProvinceId(val.id);
                setData({
                  ...data,
                  regency_id: null,
                });
              }}
            />
          </div>

          <div>
            <InputLabel htmlFor="regency_id" value="Pilih Kabupaten" />
            <NewCombobox
              data={Array.isArray(regencies) ? regencies : []}
              valueKey="id"
              labelKey="name"
              isLoading={isLoadingRegencies}
              placeholder="Pilih Kabupaten"
              defaultValue={data?.regency_id ?? undefined}
              onSelect={(val: any) => {
                setData({
                  ...data,
                  regency_id: val.id,
                });
              }}
            />

            <InputError message={errors.regency_id} className="mt-2" />
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
            <Button
              variant={"outline"}
              onClick={(e) => {
                handleBubbleEvent(e);
                handleOpen?.(false);
              }}>
              Batal
            </Button>
            <Button type={"submit"} disabled={processing}>
              {district ? "Update Data" : "Simpan Data"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateUpdateDistrictModal;
