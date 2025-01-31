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
import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import RenderList from "@/components/common/render-list";
import { router } from "@inertiajs/react";
import axios from "axios";
import { LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormSkoringQuestionUtils } from "./form-scoring-question.utils";

interface FormSkoringQuestionProps {
  isEdit?: boolean;
  scoring_question_category?: any;
}

const FormSkoringQuestion: React.FC<FormSkoringQuestionProps> = ({ isEdit, scoring_question_category }) => {
  const [scorings, setScorings] = useState([]);
  const [scoringId, setScoringId] = useState<string>(() => (isEdit ? scoring_question_category?.scoring_id : ""));
  const [scoringQuestionCategory, setScoringQuestionCategory] = useState([]);
  const [scoringQuestionId, setScoringQuestionId] = useState<string>(() =>
    isEdit ? scoring_question_category?.category_id : "",
  );
  const [isOpenForm, setIsOpenForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResetCombobox, setIsResetCombobox] = useState<boolean>(false);

  const [errors, setErrors] = useState<{
    name: Array<string> | null;
    scoring_question_category_id: Array<string> | null;
  }>({
    name: null,
    scoring_question_category_id: null,
  });

  const [dataForm, setDataForm] = useState<{
    name: string;
    scoring_question_category_id: number | undefined;
  }>(() => ({
    name: isEdit ? scoring_question_category?.name : "",
    scoring_question_category_id: isEdit ? scoring_question_category?.category_id : undefined,
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

  useEffect(() => {
    if (scoringId) {
      axios
        .get(route("scoring-question-category.get-by-scoring", scoringId))
        .then((response) => {
          setScoringQuestionCategory(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [scoringId]);

  const submit = () => {
    setIsLoading(true);

    if (isEdit) {
      axios
        .put(
          route(FormSkoringQuestionUtils.edit.route, {
            scoringQuestion: scoring_question_category?.id,
          }),
          { ...dataForm },
        )
        .then(() => {
          toast({
            ...FormSkoringQuestionUtils.edit.toast_success,
          });
          handleCloseForm();
          router.get(route("scoring-question.index"), {});
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormSkoringQuestionUtils.edit.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      axios
        .post(route(FormSkoringQuestionUtils.create.route), { ...dataForm })
        .then(() => {
          toast({
            ...FormSkoringQuestionUtils.create.toast_success,
          });
          handleCloseForm();
          router.get(route("scoring-question.index"), {});
        })
        .catch((error) => {
          setErrors(error.response.data.errors);
          toast({
            ...FormSkoringQuestionUtils.create.toast_failed,
            variant: "destructive",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const handleCloseForm = () => {
    if (errors?.name || errors?.scoring_question_category_id) {
      setErrors({ name: null, scoring_question_category_id: null });
    }
    if (!isEdit) {
      setDataForm({ name: "", scoring_question_category_id: undefined });
    }
    setIsResetCombobox(true);
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
          {isEdit ? FormSkoringQuestionUtils.edit.title : FormSkoringQuestionUtils.create.title}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="w-[400px] space-y-3">
        <AlertDialogHeader className="space-y-1">
          <AlertDialogTitle>
            {isEdit ? FormSkoringQuestionUtils.edit.title : FormSkoringQuestionUtils.create.title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isEdit ? FormSkoringQuestionUtils.edit.sub_title : FormSkoringQuestionUtils.create.sub_title}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          id="skoring-question-form"
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
            <Label htmlFor="min_point">Skoring</Label>
            <Combobox
              labelKey={"name"}
              valueKey={"name"}
              placeholder={"Pilih Skoring"}
              reset={isResetCombobox}
              datas={scorings}
              defaultValueId={scoringId}
              onReset={setIsResetCombobox}
              onSelect={(value) => {
                setScoringId(value?.id);
              }}
            />
          </div>
          <div className="grid gap-[5px]">
            <Label htmlFor="min_point">Kategori Pertanyaan</Label>
            <Combobox
              labelKey={"name"}
              valueKey={"name"}
              placeholder={"Pilih Kategori Pertanyaan"}
              reset={isResetCombobox}
              datas={scoringQuestionCategory}
              defaultValueId={scoringQuestionId}
              onReset={setIsResetCombobox}
              onSelect={(value) => {
                setScoringQuestionId(value?.id);
                setDataForm({ ...dataForm, scoring_question_category_id: value?.id });
              }}
            />
            <RenderList
              of={errors.scoring_question_category_id ?? []}
              render={(error: string, index: number) => <InputError key={index + 1} className="mt-1" message={error} />}
            />
          </div>
          <div className="flex justify-end gap-x-3">
            <AlertDialogCancel onClick={handleCloseForm}>Batal</AlertDialogCancel>
            <Button form="skoring-question-form" className="w-max" disabled={isLoading}>
              {isLoading && <LoaderCircle className="animate-spin mr-1 flex-shrink-0" />}
              {isEdit ? FormSkoringQuestionUtils.edit.btn_label : FormSkoringQuestionUtils.create.btn_label}
            </Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FormSkoringQuestion;
