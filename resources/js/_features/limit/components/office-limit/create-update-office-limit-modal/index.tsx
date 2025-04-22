import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/_features/_common/components/_shadcn-ui/alert-dialog";
import { Button } from "@/_features/_common/components/_shadcn-ui/button";
import { Label } from "@/_features/_common/components/_shadcn-ui/label";
import { handleBubbleEvent } from "@/_features/_common/utils/dom";
import { OFFICE_LIMIT_QUERY_KEY } from "@/_features/limit/services/office-limit-query";
import { GUARANTOR_PRODUCT_TYPE_LIMIT_QUERY_KEY } from "@/_features/limit/services/product-type-limit-query";
import InputCurrency from "@/components/molecules/input/currency-input";
import InputError from "@/components/molecules/input/error-input";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { useForm } from "@inertiajs/react";
import { CircleAlertIcon, LoaderCircle } from "lucide-react";
import { FormEvent, useEffect } from "react";

interface CreateUpdateOfficeLimitModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  officeLimit?: any;
}

export default function CreateUpdateOfficeLimitModal({
  open,
  handleOpen,
  officeLimit,
}: CreateUpdateOfficeLimitModalProps) {
  const { data, setData, post, put, errors, processing, reset } = useForm<{
    guarantor_id: number;
    guarantor_to_product_type_id: number;
    profile_id: number;
    name: string;
    limit: string | number | undefined;
    limit_inherit: string | number | undefined;
  }>({
    guarantor_id: officeLimit?.guarantor_id,
    guarantor_to_product_type_id: officeLimit?.guarantor_to_product_type_id,
    profile_id: officeLimit?.id,
    name: officeLimit?.name,
    limit: officeLimit?.limit ?? 0,
    limit_inherit: officeLimit?.limit_inherit ?? 0,
  });

  useEffect(() => {
    if (officeLimit && typeof officeLimit === "object") {
      setData({
        guarantor_id: officeLimit?.guarantor_id,
        guarantor_to_product_type_id: officeLimit?.guarantor_to_product_type_id,
        profile_id: officeLimit?.id,
        name: officeLimit?.name,
        limit: officeLimit?.limit ?? 0,
        limit_inherit: officeLimit?.limit_inherit ?? 0,
      });
    }
  }, [officeLimit]);

  console.log({
    ...data,
  });

  const createOfficeLimit = () => {};

  const updateOfficeLimit = () => {
    if (data.profile_id) {
      console.log(route("profile-limit.update", { id: data.profile_id }));
      put(route("profile-limit.update", { id: data.profile_id }), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [OFFICE_LIMIT_QUERY_KEY.SEARCH],
              refetchType: "active",
            }),
          ]);
          reset();
          handleOpen?.(false);
        },
      });
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (data.profile_id) {
      updateOfficeLimit();
    } else {
      createOfficeLimit();
    }
  };

  if (!open) return null;

  return (
    <AlertDialog open={open} onOpenChange={handleOpen}>
      <AlertDialogContent className="max-w-md">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <CircleAlertIcon className="opacity-80" size={16} />
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle className="sm:text-center">
              {officeLimit.limit ? "Update Batas Kewenangan Nilai Kantor" : "Tambah Batas Kewenangan Nilai Kantor"}
            </AlertDialogTitle>
            <AlertDialogDescription className="sm:text-center">
              {officeLimit.limit
                ? "Anda akan mengupdate batas kewenangan nilai kantor."
                : "Anda akan menambahkan batas kewenangan nilai kantor."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <form onSubmit={handleFormSubmit} id={`form-create-update-office-limit`} className="space-y-4">
          {/* LIMIT */}
          <div>
            <Label htmlFor={`limit`}>Batas Kewenangan Nilai</Label>
            <InputCurrency
              value={data?.limit ? data?.limit?.toString() : ""}
              placeholder="Batas Kewenangan Nilai Jaminan Kantor"
              onChange={(e) => setData({ ...data, limit: e || "" })}
            />
            <InputError message={errors?.limit} />
          </div>
          {/* LIMIT INHERIT */}
          <div>
            <Label htmlFor={`limit-inherit`}>Batas Kewenangan Turunan</Label>
            <InputCurrency
              value={data.limit_inherit ? data.limit_inherit?.toString() : ""}
              placeholder="Batas Kewenangan Nilai Jaminan Turunan Kantor"
              onChange={(e) => setData({ ...data, limit_inherit: e || "" })}
            />
            <InputError message={errors?.limit_inherit} />
          </div>
        </form>
        <AlertDialogFooter className="flex gap-2">
          <Button
            variant={"outline"}
            type="button"
            className="flex-1"
            onClick={(e) => {
              handleBubbleEvent(e);
              handleOpen?.(false);
            }}>
            Batal
          </Button>
          <Button form={`form-create-update-office-limit`} type={"submit"} disabled={processing} className="flex-1">
            {processing && <LoaderCircle className="animate-spin mr-1" />}
            {officeLimit.limit ? "Update Data" : "Simpan Data"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
