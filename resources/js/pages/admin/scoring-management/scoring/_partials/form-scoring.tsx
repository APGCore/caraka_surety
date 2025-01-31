import { toast } from "@/common/hooks/general/use-toast";
import { cn } from "@/common/utils/cn";
import { getNumericValue } from "@/common/utils/get-numeric-value";
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
import { FormSkoringUtils } from "./form-scoring.utils";

interface FormSkoringProps {
  isEdit?: boolean;
  scoring?: any;
}

const FormSkoring: React.FC<FormSkoringProps> = ({ isEdit, scoring }) => {
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ name: Array<string> | null; min_point: Array<string> | null }>({
    name: null,
    min_point: null,
  });

  const [dataForm, setDataForm] = useState<{
    name: string;
    min_point: number | undefined;
  }>(() => ({
    name: isEdit ? scoring?.name : "",
    min_point: isEdit ? scoring?.min_point : undefined,
  }));

  const submit = () => {
    setIsLoading(true);

    if (isEdit) {
      axios
        .put(
          route(FormSkoringUtils.edit.route, {
            scoring: scoring.id,
          }),
          { ...dataForm },
        )
        .then(() => {
          toast({
            ...FormSkoringUtils.edit.toast_success,
          });
          setErrors({ name: null, min_point: null });
          setIsOpenForm(false);
          router.get(route("scoring.index"), {});
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormSkoringUtils.edit.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .post(route(FormSkoringUtils.create.route), { ...dataForm })
        .then(() => {
          toast({
            ...FormSkoringUtils.create.toast_success,
          });
          setErrors({ name: null, min_point: null });
          setIsOpenForm(false);
          router.get(route("scoring.index"), {});
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormSkoringUtils.create.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleCloseForm = () => {
    if (errors?.name || errors?.min_point) {
      setErrors({ name: null, min_point: null });
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
          {isEdit ? FormSkoringUtils.edit.btn_label : FormSkoringUtils.create.title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px] space-y-3">
        <AlertDialogHeader className="space-y-1">
          <AlertDialogTitle>{isEdit ? FormSkoringUtils.edit.title : FormSkoringUtils.create.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit ? FormSkoringUtils.edit.sub_title : FormSkoringUtils.create.sub_title}
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
              placeholder="Masukan nama skoring"
              required
              value={dataForm.name}
              onChange={(e) => setDataForm({ ...dataForm, name: e.target.value })}
            />
            <RenderList
              of={errors.name ?? []}
              render={(error: string, index: number) => <InputError key={index + 1} className="mt-1" message={error} />}
            />
          </div>
          <div className="grid gap-[5px]">
            <Label htmlFor="min_point">Poin Minimal</Label>
            <Input
              id="min_point"
              type="number"
              required
              value={dataForm.min_point}
              placeholder="Masukan poin minimal"
              onChange={(e) => setDataForm({ ...dataForm, min_point: getNumericValue(e) })}
            />
            <RenderList
              of={errors.min_point ?? []}
              render={(error: string, index: number) => <InputError key={index + 1} className="mt-1" message={error} />}
            />
          </div>
          <div className="flex justify-end gap-x-3">
            <AlertDialogCancel onClick={handleCloseForm}>Batal</AlertDialogCancel>
            <Button form="skoring-form" className="w-max" disabled={isLoading}>
              {isLoading && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
              {isEdit ? FormSkoringUtils.edit.btn_label : FormSkoringUtils.create.btn_label}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormSkoring;
