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
import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import RenderList from "@/components/common/render-list";
import { router } from "@inertiajs/react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormSkoringQuestionCategoryUtils } from "./form-scoring-question-category.utils";

interface FormSkoringQuestionCategoryProps {
  isEdit?: boolean;
  scoringQuestionCategory?: any;
}

const FormSkoringQuestionCategory: React.FC<FormSkoringQuestionCategoryProps> = ({
  isEdit,
  scoringQuestionCategory,
}) => {
  const [scorings, setScorings] = useState([]);
  const [scoringId, setScoringId] = useState<string>(() => (isEdit ? scoringQuestionCategory?.scoring_id : ""));

  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResetCombobox, setIsResetCombobox] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    name: Array<string> | null;
    max_point: Array<string> | null;
    scoring_id: Array<string> | null;
  }>({
    name: null,
    max_point: null,
    scoring_id: null,
  });

  const [dataForm, setDataForm] = useState<{
    name: string;
    max_point: number | undefined;
    scoring_id: number | undefined;
  }>(() => ({
    name: isEdit ? scoringQuestionCategory?.name : "",
    max_point: isEdit ? scoringQuestionCategory?.max_point : undefined,
    scoring_id: isEdit ? scoringQuestionCategory?.scoring_id : undefined,
  }));

  useEffect(() => {
    axios
      .get(route("scoring.all"))
      .then((response) => {
        setScorings(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const submit = () => {
    setIsLoading(true);

    if (isEdit) {
      axios
        .put(
          route(FormSkoringQuestionCategoryUtils.edit.route, {
            scoringQuestionCategory: scoringQuestionCategory?.id,
          }),
          { ...dataForm },
        )
        .then(() => {
          toast({
            ...FormSkoringQuestionCategoryUtils.edit.toast_success,
          });
          handleCloseForm();
          router.get(
            route(FormSkoringQuestionCategoryUtils.fallback.route.index) + `?scoring_id=${dataForm.scoring_id}`,
            {},
          );
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormSkoringQuestionCategoryUtils.edit.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .post(route(FormSkoringQuestionCategoryUtils.create.route), { ...dataForm })
        .then(() => {
          toast({
            ...FormSkoringQuestionCategoryUtils.create.toast_success,
          });
          handleCloseForm();
          router.get(
            route(FormSkoringQuestionCategoryUtils.fallback.route.index) + `?scoring_id=${dataForm.scoring_id}`,
            {},
            {
              onSuccess: () => {
                setIsResetCombobox(true);
                setScoringId("");
                setDataForm({ name: "", max_point: undefined, scoring_id: undefined });
              },
            },
          );
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormSkoringQuestionCategoryUtils.create.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleCloseForm = () => {
    if (errors?.name || errors?.max_point || errors?.scoring_id) {
      setErrors({ name: null, max_point: null, scoring_id: null });
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
          {isEdit ? FormSkoringQuestionCategoryUtils.edit.btn_label : FormSkoringQuestionCategoryUtils.create.title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px] space-y-3">
        <AlertDialogHeader className="space-y-1">
          <AlertDialogTitle>
            {isEdit ? FormSkoringQuestionCategoryUtils.edit.title : FormSkoringQuestionCategoryUtils.create.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit
              ? FormSkoringQuestionCategoryUtils.edit.sub_title
              : FormSkoringQuestionCategoryUtils.create.sub_title}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          id="skoring-question-category-form"
          className="grid gap-6">
          <div className="grid gap-[5px]">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              type="text"
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
            <Label htmlFor="max_point">Poin Maksimal</Label>
            <Input
              id="max_point"
              type="number"
              placeholder="Masukan poin maksimal"
              required
              value={dataForm.max_point}
              onChange={(e) => setDataForm({ ...dataForm, max_point: getNumericValue(e) })}
            />
            <RenderList
              of={errors.max_point ?? []}
              render={(error: string, index: number) => <InputError key={index + 1} className="mt-1" message={error} />}
            />
          </div>
          <div className="grid gap-[5px]">
            <Label htmlFor="scoring_id">Skoring</Label>
            <Combobox
              id="scoring_id"
              labelKey={"name"}
              valueKey={"name"}
              placeholder={"Pilih Skoring"}
              reset={isResetCombobox}
              datas={scorings}
              defaultValueId={scoringId}
              onReset={setIsResetCombobox}
              onSelect={(value) => {
                setScoringId(value?.id);
                setDataForm({ ...dataForm, scoring_id: value?.id });
              }}
            />
            <RenderList
              of={errors.scoring_id ?? []}
              render={(error: string, index: number) => <InputError key={index + 1} className="mt-1" message={error} />}
            />
          </div>
          <div className="flex justify-end gap-x-3">
            <AlertDialogCancel onClick={handleCloseForm}>Batal</AlertDialogCancel>
            <Button form="skoring-question-category-form" className="w-max" disabled={isLoading}>
              {isLoading && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
              {isEdit
                ? FormSkoringQuestionCategoryUtils.edit.btn_label
                : FormSkoringQuestionCategoryUtils.create.btn_label}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormSkoringQuestionCategory;
