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
import { FormEmployeeLimitsUtils } from "./form-employee-limits.utils";

interface FormEmployeeLimitsProps {
  isEdit?: boolean;
  guarantorSelectedId: any;
  profileSelectedId: any;
  employee?: any;
}

const FormEmployeeLimits: React.FC<FormEmployeeLimitsProps> = ({
  isEdit,
  guarantorSelectedId,
  profileSelectedId,
  employee,
}) => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const defaultData = { guarantor_id: null, profile_id: null, employee_id: null, name: null, limit: null };
  const [errors, setErrors] = useState<{
    guarantor_id: Array<number> | null;
    profile_id: Array<number> | null;
    employee_id: Array<number> | null;
    name: Array<string> | null;
    limit: Array<string> | null;
  }>(defaultData);

  const [dataForm, setDataForm] = useState<{
    guarantor_id: number;
    profile_id: number;
    employee_id: number;
    name: string;
    limit: string | undefined;
  }>({
    guarantor_id: guarantorSelectedId,
    profile_id: profileSelectedId ?? 0,
    employee_id: employee?.id ?? 0,
    name: employee?.name ?? "",
    limit: employee?.employee_limit?.limit ?? undefined,
  });

  const submit = () => {
    setIsLoading(true);

    if (isEdit) {
      axios
        .put(route(FormEmployeeLimitsUtils.edit.route, employee?.employee_limit?.id), { ...dataForm })
        .then(() => {
          toast({
            ...FormEmployeeLimitsUtils.edit.toast_success,
          });
          setErrors(defaultData);
          setIsOpenForm(false);
          router.get(
            route(FormEmployeeLimitsUtils.redirect, {
              guarantor_id: guarantorSelectedId,
              profile_id: profileSelectedId,
            }),
          );
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormEmployeeLimitsUtils.edit.toast_failed,
            description: error.response.data.message,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .post(route(FormEmployeeLimitsUtils.create.route), { ...dataForm })
        .then(() => {
          toast({
            ...FormEmployeeLimitsUtils.create.toast_success,
          });
          setErrors(defaultData);
          setIsOpenForm(false);
          router.get(
            route(FormEmployeeLimitsUtils.redirect, {
              guarantor_id: guarantorSelectedId,
              profile_id: profileSelectedId,
            }),
          );
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormEmployeeLimitsUtils.create.toast_failed,
            description: error.response.data.message,
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
      setErrors(defaultData);
    }
    setIsOpenForm(false);
  };

  return (
    <AlertDialog open={isOpenForm} onOpenChange={setIsOpenForm}>
      <AlertDialogTrigger asChild>
        <Button className={cn(FormEmployeeLimitsUtils.create.class_name)}>
          {isEdit ? FormEmployeeLimitsUtils.edit.title : FormEmployeeLimitsUtils.create.title} {dataForm?.name}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px] space-y-3">
        <AlertDialogHeader className="space-y-1">
          <AlertDialogTitle>
            {isEdit ? FormEmployeeLimitsUtils.edit.title : FormEmployeeLimitsUtils.create.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit ? FormEmployeeLimitsUtils.edit.sub_title : FormEmployeeLimitsUtils.create.sub_title}
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
              {isEdit ? FormEmployeeLimitsUtils.edit.btn_label : FormEmployeeLimitsUtils.create.btn_label}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormEmployeeLimits;
