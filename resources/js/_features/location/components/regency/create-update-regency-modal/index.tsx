import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { useGetAllProvince } from "@/_features/location/services/province-location-query";
import { REGENCY_LOCATION_QUERY_KEY } from "@/_features/location/services/regency-location-query";
import NewCombobox from "@/components/atoms/new-combobox";
import InputError from "@/components/molecules/input/error-input";
import InputLabel from "@/components/molecules/input/label-input";
import TextInput from "@/components/molecules/input/text-input";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { useForm } from "@inertiajs/react";
import { FormEvent, useEffect } from "react";

interface CreateUpdateRegencyModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  regency?: any;
}

const CreateUpdateRegencyModal = ({ open, handleOpen, regency }: CreateUpdateRegencyModalProps) => {
  const { data, setData, errors, post, put, reset, processing } = useForm({
    id: "",
    province_id: "",
    code: "",
    name: "",
  });

  const { data: provinces, isLoading: isLoadingProvinces } = useGetAllProvince();

  useEffect(() => {
    if (regency && typeof regency === "object") {
      setData({
        id: regency.id,
        province_id: regency.province_id,
        code: regency.code,
        name: regency.name,
      });
    }
  }, [regency]);

  const createRegency = () => {
    post(route("regency.store"), {
      preserveState: true,
      preserveScroll: false,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [REGENCY_LOCATION_QUERY_KEY.SEARCH_REGENCY],
            refetchType: "active",
          }),
          queryClient.invalidateQueries({
            queryKey: [REGENCY_LOCATION_QUERY_KEY.GET_ALL_REGENCY],
            refetchType: "active",
          }),
        ]);
        reset();
        handleOpen?.(false);
      },
    });
  };

  const updateRegency = () => {
    put(
      route("regency.update", {
        id: data.id,
      }),
      {
        preserveState: true,
        preserveScroll: false,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [REGENCY_LOCATION_QUERY_KEY.SEARCH_REGENCY],
              refetchType: "active",
            }),
            queryClient.invalidateQueries({
              queryKey: [REGENCY_LOCATION_QUERY_KEY.GET_ALL_REGENCY],
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

    if (regency) {
      updateRegency();
    } else {
      createRegency();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{regency ? "Memperbarui Kabupaten" : "Membuat Kabupaten"}</AlertDialogTitle>
          <AlertDialogDescription>
            {regency ? "Tindakan ini akan memperbarui data kabupaten" : "Tindakan ini akan menambah data kabupaten"}
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
              defaultValue={data?.province_id}
              onSelect={(val: any) => {
                setData({
                  ...data,
                  province_id: val.id,
                });
              }}
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
            <Button
              variant={"outline"}
              onClick={(e) => {
                handleBubbleEvent(e);
                handleOpen?.(false);
              }}>
              Batal
            </Button>
            <Button type={"submit"} disabled={processing}>
              {regency ? "Update Data" : "Simpan Data"}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateUpdateRegencyModal;
