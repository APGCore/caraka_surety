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
import { GUARANTOR_PRODUCT_TYPE_LIMIT_QUERY_KEY } from "@/_features/limit/services/product-type-limit-query";
import InputCurrency from "@/components/molecules/input/currency-input";
import InputError from "@/components/molecules/input/error-input";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import { useForm } from "@inertiajs/react";
import { CircleAlertIcon, LoaderCircle } from "lucide-react";
import { FormEvent, useEffect } from "react";

interface CreateUpdateProductTypeLimitModalProps {
  open: boolean;
  handleOpen?: (open: boolean) => void;
  guarantorProductType?: any;
  guarantorId?: string | number;
}

export default function CreateUpdateProductTypeLimitModal({
  open,
  handleOpen,
  guarantorProductType,
  guarantorId,
}: CreateUpdateProductTypeLimitModalProps) {
  const { data, setData, post, put, errors, processing, reset } = useForm<{
    id?: number;
    guarantor_id: number | string;
    guarantor_to_product_type_id: number;
    limit: string | number | undefined;
    limit_inherit: string | number | undefined;
  }>({
    id: guarantorProductType?.limit?.id,
    guarantor_id: guarantorProductType?.guarantor_id ?? guarantorId,
    guarantor_to_product_type_id: guarantorProductType?.id,
    limit: guarantorProductType?.limit?.limit ?? "",
    limit_inherit: guarantorProductType?.limit?.limit_inherit ?? false,
  });

  useEffect(() => {
    if (guarantorProductType && typeof guarantorProductType === "object") {
      setData({
        id: guarantorProductType?.limit?.id,
        guarantor_id: guarantorProductType?.guarantor_id ?? guarantorId,
        guarantor_to_product_type_id: guarantorProductType?.id,
        limit: guarantorProductType?.limit?.limit ?? "",
        limit_inherit: guarantorProductType?.limit?.limit_inherit ?? false,
      });
    }
  }, [guarantorProductType, guarantorId]);

  const createProductTypeLimit = () => {
    post(route("guarantor-product-type-limit.store"), {
      preserveState: true,
      preserveScroll: true,
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries({
            queryKey: [GUARANTOR_PRODUCT_TYPE_LIMIT_QUERY_KEY.GUARANTOR_PRODUCT_TYPE_LIMIT],
            refetchType: "active",
          }),
        ]);
        reset();
        handleOpen?.(false);
      },
    });
  };

  const updateProductTypeLimit = () => {
    if (data.id) {
      console.log(route("guarantor-product-type-limit.update", { id: data.id }));
      put(route("guarantor-product-type-limit.update", { id: data.id }), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: async () => {
          await Promise.all([
            queryClient.invalidateQueries({
              queryKey: [GUARANTOR_PRODUCT_TYPE_LIMIT_QUERY_KEY.GUARANTOR_PRODUCT_TYPE_LIMIT],
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

    if (guarantorProductType?.limit) {
      updateProductTypeLimit();
    } else {
      createProductTypeLimit();
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
              {guarantorProductType.limit ? "Update Batas Kewenangan Nilai" : "Tambah Batas Kewenangan Nilai"}
            </AlertDialogTitle>
            <AlertDialogDescription className="sm:text-center">
              {guarantorProductType.limit
                ? "Anda akan mengupdate batas kewenangan nilai jaminan."
                : "Anda akan menambahkan batas kewenangan nilai jaminan."}
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <form onSubmit={handleFormSubmit} id={`form-create-update-product-type-limit`} className="space-y-4">
          {/* LIMIT */}
          <div>
            <Label htmlFor={`limit`}>Batas Kewenangan Nilai</Label>
            <InputCurrency
              placeholder="Batas Kewenangan Nilai Jaminan"
              value={data.limit?.toString() ?? ""}
              onChange={(e) => setData({ ...data, limit: e || "" })}
            />
            <InputError message={errors?.limit} />
          </div>
          {/* LIMIT INHERIT */}
          <div>
            <Label htmlFor={`limit-inherit`}>Batas Kewenangan Turunan</Label>
            <InputCurrency
              value={data.limit_inherit ? data.limit_inherit?.toString() : ""}
              placeholder="Batas Kewenangan Nilai Jaminan Turunan"
              onChange={(e) => setData({ ...data, limit_inherit: e || "" })}
            />
            <InputError message={errors?.limit_inherit} />
          </div>
        </form>
        <AlertDialogFooter>
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
          <Button
            form={`form-create-update-product-type-limit`}
            type={"submit"}
            disabled={processing}
            className="flex-1">
            {processing && <LoaderCircle className="animate-spin mr-1" />}
            {guarantorProductType.limit ? "Update Data" : "Simpan Data"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
