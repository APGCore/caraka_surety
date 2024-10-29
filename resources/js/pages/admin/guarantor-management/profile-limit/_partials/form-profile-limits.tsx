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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/cn";
import { router } from "@inertiajs/react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { FormProfileLimitsUtils } from "./form-profile-limits.utils";

interface FormProfileLimitsProps {
  isEdit?: boolean;
  guarantorSelectedId: any;
  profile?: any;
}

const FormProfileLimits: React.FC<FormProfileLimitsProps> = ({ isEdit, guarantorSelectedId, profile }) => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    guarantor_id: Array<number> | null;
    profile_id: Array<number> | null;
    name: Array<string> | null;
    limit: Array<string> | null;
  }>({
    guarantor_id: null,
    profile_id: null,
    name: null,
    limit: null,
  });

  const [dataForm, setDataForm] = useState<{
    guarantor_id: number;
    profile_id: number;
    name: string;
    limit: string | undefined;
  }>({
    guarantor_id: guarantorSelectedId,
    profile_id: profile?.id ?? 0,
    name: profile?.name ?? "",
    limit: profile?.profile_limit?.limit ?? undefined,
  });

  const submit = () => {
    setIsLoading(true);

    if (isEdit) {
      axios
        .put(route(FormProfileLimitsUtils.edit.route, profile?.profile_limit?.id), { ...dataForm })
        .then(() => {
          toast({
            ...FormProfileLimitsUtils.edit.toast_success,
          });
          setErrors({ guarantor_id: null, profile_id: null, name: null, limit: null });
          setIsOpenForm(false);
          router.get(route(FormProfileLimitsUtils.redirect, { guarantor_id: guarantorSelectedId }));
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormProfileLimitsUtils.edit.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .post(route(FormProfileLimitsUtils.create.route), { ...dataForm })
        .then(() => {
          toast({
            ...FormProfileLimitsUtils.create.toast_success,
          });
          setErrors({ guarantor_id: null, profile_id: null, name: null, limit: null });
          setIsOpenForm(false);
          router.get(route(FormProfileLimitsUtils.redirect, { guarantor_id: guarantorSelectedId }));
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormProfileLimitsUtils.create.toast_failed,
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
      setErrors({ guarantor_id: null, profile_id: null, name: null, limit: null });
    }
    setIsOpenForm(false);
  };

  return (
    <AlertDialog open={isOpenForm} onOpenChange={setIsOpenForm}>
      <AlertDialogTrigger asChild>
        <Button className={cn(FormProfileLimitsUtils.create.class_name)}>
          {isEdit ? FormProfileLimitsUtils.edit.title : FormProfileLimitsUtils.create.title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px] space-y-3">
        <AlertDialogHeader className="space-y-1">
          <AlertDialogTitle>
            {isEdit ? FormProfileLimitsUtils.edit.title : FormProfileLimitsUtils.create.title} {dataForm.name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit ? FormProfileLimitsUtils.edit.sub_title : FormProfileLimitsUtils.create.sub_title}
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
              {isEdit ? FormProfileLimitsUtils.edit.btn_label : FormProfileLimitsUtils.create.btn_label}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormProfileLimits;
