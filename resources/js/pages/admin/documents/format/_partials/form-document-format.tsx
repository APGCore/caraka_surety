import InputCurrency from "@/components/common/input-currency";
import InputError from "@/components/common/input-error";
import RenderList from "@/components/common/render-list";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/general/use-toast";
import { cn } from "@/lib/cn";
import { router } from "@inertiajs/react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { FormDocumentFormatUtils } from "./form-document-format.utils";

interface FormProfileLimitsProps {
  isEdit?: boolean;
  guarantorSelectedId: number;
  guarantorProductId: number;
  guarantorProductTypeId: number;
  profile?: any;
}

const FormDocumentFormat: React.FC<FormProfileLimitsProps> = ({
  isEdit,
  guarantorSelectedId,
  guarantorProductId,
  guarantorProductTypeId,
  profile,
}) => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const defaultErrors = {
    guarantor_id: null,
    guarantor_to_product_type_id: null,
    profile_id: null,
    name: null,
    limit: null,
  };
  const [errors, setErrors] = useState<{
    guarantor_id: Array<number> | null;
    guarantor_to_product_type_id: Array<number> | null;
    profile_id: Array<number> | null;
    name: Array<string> | null;
    limit: Array<string> | null;
  }>(defaultErrors);

  const [dataForm, setDataForm] = useState<{
    guarantor_id: number;
    guarantor_to_product_type_id: number;
    profile_id: number;
    name: string;
    limit: string | undefined;
  }>({
    guarantor_id: guarantorSelectedId,
    guarantor_to_product_type_id: guarantorProductTypeId,
    profile_id: profile?.id ?? 0,
    name: profile?.name ?? "",
    limit: profile?.profile_limit?.limit ?? undefined,
  });

  const submit = () => {
    setIsLoading(true);

    if (isEdit) {
      axios
        .put(route(FormDocumentFormatUtils.edit.route, profile?.profile_limit?.id), { ...dataForm })
        .then(() => {
          toast({
            ...FormDocumentFormatUtils.edit.toast_success,
          });
          setErrors(defaultErrors);
          setIsOpenForm(false);
          router.get(
            route(FormDocumentFormatUtils.redirect, {
              guarantor_id: guarantorSelectedId,
              guarantor_product_id: guarantorProductId,
              guarantor_product_type_id: guarantorProductTypeId,
            }),
          );
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormDocumentFormatUtils.edit.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .post(route(FormDocumentFormatUtils.create.route), { ...dataForm })
        .then(() => {
          toast({
            ...FormDocumentFormatUtils.create.toast_success,
          });
          setErrors(defaultErrors);
          setIsOpenForm(false);
          router.get(
            route(FormDocumentFormatUtils.redirect, {
              guarantor_id: guarantorSelectedId,
              guarantor_product_id: guarantorProductId,
              guarantor_product_type_id: guarantorProductTypeId,
            }),
          );
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormDocumentFormatUtils.create.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleCloseForm = () => {
    if (errors?.name || errors?.limit) {
      setErrors(defaultErrors);
    }
    setIsOpenForm(false);
  };

  return (
    <AlertDialog open={isOpenForm} onOpenChange={setIsOpenForm}>
      <AlertDialogTrigger asChild>
        <Button className={cn(FormDocumentFormatUtils.create.class_name)}>
          {isEdit ? FormDocumentFormatUtils.edit.title : FormDocumentFormatUtils.create.title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px] space-y-3">
        <AlertDialogHeader className="space-y-1">
          <AlertDialogTitle>
            {isEdit ? FormDocumentFormatUtils.edit.title : FormDocumentFormatUtils.create.title} {dataForm.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit ? FormDocumentFormatUtils.edit.sub_title : FormDocumentFormatUtils.create.sub_title}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          id="profile-limit-form"
          className="grid gap-6">
          <div className="grid gap-[5px]">
            <Label htmlFor="limit">Limit Pengajuan</Label>
            <InputCurrency
              id="limit"
              type="string"
              required
              value={dataForm.limit ?? ""}
              placeholder="Masukan limit pengajuan"
              onChange={(limit) => setDataForm({ ...dataForm, limit: limit })}
            />
            <RenderList
              of={errors?.limit ?? []}
              render={(error: string, index: number) => <InputError key={index + 1} className="mt-1" message={error} />}
            />
          </div>
          <div className="flex justify-end gap-x-3">
            <AlertDialogCancel onClick={handleCloseForm}>Batal</AlertDialogCancel>
            <Button form="profile-limit-form" className="w-max" disabled={isLoading}>
              {isLoading && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
              {isEdit ? FormDocumentFormatUtils.edit.btn_label : FormDocumentFormatUtils.create.btn_label}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormDocumentFormat;
