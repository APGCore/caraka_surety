import { toast } from "@/common/hooks/general/use-toast";
import { cn } from "@/common/utils/cn";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/_shadcn-ui/alert-dialog";
import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import InputError from "@/components/common/input-error";
import RenderList from "@/components/common/render-list";
import { router } from "@inertiajs/react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { FormSourceOfFundsUtils } from "./form-source-of-funds.utils";

interface SourceOfFundsProps {
  isEdit?: boolean;
  sourceOfFunds?: any;
}

const FormSourceOfFunds: React.FC<SourceOfFundsProps> = ({ isEdit, sourceOfFunds }) => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name: Array<string> | null }>({
    name: null,
  });

  const [dataForm, setDataForm] = useState<{
    name: string;
  }>(() => ({
    name: isEdit ? sourceOfFunds?.name : "",
  }));

  const submit = () => {
    setIsLoading(true);

    if (isEdit) {
      axios
        .put(route(FormSourceOfFundsUtils.edit.route, sourceOfFunds.id), { ...dataForm })
        .then(() => {
          toast({
            ...FormSourceOfFundsUtils.edit.toast_success,
          });
          setErrors({ name: null });
          handleCloseForm();
          router.get(route(FormSourceOfFundsUtils.index.route), {});
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormSourceOfFundsUtils.edit.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .post(route(FormSourceOfFundsUtils.create.route), { ...dataForm })
        .then(() => {
          toast({
            ...FormSourceOfFundsUtils.create.toast_success,
          });
          setErrors({ name: null });
          handleCloseForm();
          router.get(route(FormSourceOfFundsUtils.index.route), {});
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormSourceOfFundsUtils.create.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleCloseForm = () => {
    if (errors?.name) {
      setErrors({ name: null });
    }
    setIsOpenForm(false);
  };

  return (
    <AlertDialog open={isOpenForm} onOpenChange={setIsOpenForm}>
      <AlertDialogTrigger asChild>
        <Button
          className={cn({
            "bg-amber-500 hover:bg-amber-500/90 shadow-sm  px-2 py-1.5 text-sm w-full rounded-sm text-start h-[32px] justify-start":
              isEdit,
          })}>
          {isEdit ? FormSourceOfFundsUtils.edit.btn_label : FormSourceOfFundsUtils.create.title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px] space-y-3">
        <AlertDialogHeader className="space-y-1">
          <AlertDialogTitle>
            {isEdit ? FormSourceOfFundsUtils.edit.title : FormSourceOfFundsUtils.create.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit ? FormSourceOfFundsUtils.edit.sub_title : FormSourceOfFundsUtils.create.sub_title}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          id="skoring-form"
          className="grid gap-6">
          <div className="grid gap-[5px]">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              type="name"
              placeholder="Masukan nama sumber dana"
              required
              value={dataForm.name}
              onChange={(e) => setDataForm({ ...dataForm, name: e.target.value })}
            />
            <RenderList
              of={errors.name ?? []}
              render={(error: string, index: number) => <InputError key={index + 1} className="mt-1" message={error} />}
            />
          </div>
          <div className="flex justify-end gap-x-3">
            <AlertDialogCancel onClick={handleCloseForm}>Batal</AlertDialogCancel>
            <Button form="skoring-form" className="w-max" disabled={isLoading}>
              {isLoading && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
              {isEdit ? FormSourceOfFundsUtils.edit.btn_label : FormSourceOfFundsUtils.create.btn_label}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormSourceOfFunds;
