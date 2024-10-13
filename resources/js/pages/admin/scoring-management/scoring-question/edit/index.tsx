import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/layouts/admin";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import EditScoringQuestionHeader from "./_partials/edit-scoring-header";
import { AdminEditScoringQuestionPageProps } from "./edit-scoring.type";

const AdminEditScoringQuestionPage: AdminEditScoringQuestionPageProps = ({ scoringQuestion }) => {
  const [scorings, setScorings] = useState([]);
  const [scoringId, setScoringId] = useState<string>(() => scoringQuestion?.scoring_id || "");
  const [scoringQuestionCategory, setScoringQuestionCategory] = useState([]);
  const [scoringQuestionCategoryId, setScoringQuestionCategoryId] = useState<string>(
    () => scoringQuestion?.category_id || "",
  );

  const { data, setData, put, processing, errors, reset } = useForm<{
    name: string;
    scoring_question_category_id: string;
  }>({
    name: scoringQuestion?.name || "",
    scoring_question_category_id: scoringQuestion?.category_id || "",
  });

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

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route("scoring-question.update", scoringQuestion?.id), {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <main className="space-y-2.5">
      <div className="border p-12 rounded-md shadow-md flex justify-center">
        <div className="w-full max-w-lg ">
          <form onSubmit={submit} id="skoring-form" className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                type="name"
                placeholder="Masukan nama pertanyaan"
                required
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scoring_question_category_id">Skoring</Label>
              <Combobox
                datas={scorings}
                labelKey={"name"}
                valueKey={"name"}
                defaultValueId={scoringId || scoringQuestion?.scoring_id}
                placeholder={"Pilih Skoring"}
                onSelect={(value) => {
                  setScoringId(value?.id);
                }}
              />
              <InputError message={errors.scoring_question_category_id} className="mt-2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scoring_question_category_id">Kategori Pertanyaan</Label>
              <Combobox
                datas={scoringQuestionCategory}
                labelKey={"name"}
                valueKey={"name"}
                placeholder={"Pilih Kategori Pertanyaan"}
                defaultValueId={scoringQuestionCategoryId || scoringQuestion?.category_id}
                onSelect={(value) => {
                  setScoringQuestionCategoryId(value?.id);
                  setData("scoring_question_category_id", value?.id);
                }}
              />
              <InputError message={errors.scoring_question_category_id} className="mt-2" />
            </div>
            <div className="flex justify-end">
              <Button form="skoring-form" className="w-full max-w-[220px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                Edit Pertanyaan Skoring
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminEditScoringQuestionPage;

AdminEditScoringQuestionPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <EditScoringQuestionHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </AdminLayout>
  );
};
