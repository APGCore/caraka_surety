import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Input } from "@/_features/_common/components/_shadcn-ui/input";
import { Label } from "@/_features/_common/components/_shadcn-ui/label";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { PROVINCE_LOCATION_QUERY_KEY } from "@/_features/location/services/province-location-query";
import InputError from "@/components/molecules/input/error-input";
import InputLabel from "@/components/molecules/input/label-input";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEvent, useEffect } from "react";

interface CreateUpdateProvinceModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  province?: any;
}

const CreateUpdateProvinceModal = ({ open, handleOpen, province }: CreateUpdateProvinceModalProps) => {
  const { data, setData, errors, post, put, reset, processing } = useForm({
    id: "",
    code: "",
    name: "",
  });

  useEffect(() => {
    if (province && typeof province === "object") {
      setData({
        id: province.id,
        code: province.code,
        name: province.name,
      });
    }
  }, [province]);

  const createProvince = () => {
    post(route("province.store"), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [PROVINCE_LOCATION_QUERY_KEY.SEARCH_PROVINCE],
            refetchType: "active",
          }),
          queryClient.invalidateQueries({
            queryKey: [PROVINCE_LOCATION_QUERY_KEY.GET_ALL_PROVINCE],
            refetchType: "active",
          }),
        ]);
        reset();
        handleOpen?.(false);
      },
    });
  };

  const updateProvince = () => {
    put(
      route("province.update", {
        id: data.id,
      }),
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [PROVINCE_LOCATION_QUERY_KEY.SEARCH_PROVINCE],
              refetchType: "active",
            }),
            queryClient.invalidateQueries({
              queryKey: [PROVINCE_LOCATION_QUERY_KEY.GET_ALL_PROVINCE],
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

    if (province) {
      updateProvince();
    } else {
      createProvince();
    }
  };

  if (!open) {
    return null;
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{province ? "Memperbarui Provinsi" : "Membuat Provinsi"}</AlertDialogTitle>
          <AlertDialogDescription>
            {province ? "Tindakan ini akan memperbarui data provinsi" : "Tindakan ini akan menambah data provinsi"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleFormSubmit} className="mt-6 space-y-6">
          <div>
            <InputLabel htmlFor="kode">Kode Provinsi</InputLabel>
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
            <Button
              variant={"outline"}
              onClick={(e) => {
                handleBubbleEvent(e);
                handleOpen?.(false);
              }}>
              Batal
            </Button>
            <Button type={"submit"} disabled={processing}>
              {processing && <RotateCw className="animate-spin mr-2" />}
              Submit
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CreateUpdateProvinceModal;
