import { getNumericValue } from "@/common/utils/get-numeric-value";
import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import InputError from "@/components/common/input-error";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEvent } from "react";
import { AdminEditScoringQuestionOptionEditPageProps } from "../edit-option-update/edit-option-update-type";
import CreateScoringQuestionOptionEditHeader from "./_partials/create-option-header";

const AdminCreateScoringQuestionOptionEditPage: AdminEditScoringQuestionOptionEditPageProps = ({
  selectedScoringQuestion,
}) => {
  const { data, setData, post, processing, errors, reset } = useForm<{
    name: string;
    point: number | undefined;
    scoring_question_id: string;
  }>({
    name: "",
    point: undefined,
    scoring_question_id: selectedScoringQuestion?.id,
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();

    post(
      route("scoring-question.store-option", {
        scoringQuestion: selectedScoringQuestion?.id,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          reset();
        },
      },
    );
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
              <Label htmlFor="point">Poin</Label>
              <Input
                id="point"
                type="number"
                required
                value={data.point}
                placeholder="Masukan poin"
                onChange={(e) => setData("point", getNumericValue(e))}
              />
              <InputError message={errors.point} className="mt-2" />
            </div>
            <div className="flex justify-end">
              <Button form="skoring-form" className="w-full max-w-[220px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                Tambah Pilihan Pertanyaan
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminCreateScoringQuestionOptionEditPage;

AdminCreateScoringQuestionOptionEditPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <CreateScoringQuestionOptionEditHeader
        title={pagePropsData?.page_settings?.title}
        selectedScoringQuestion={pagePropsData?.selectedScoringQuestion}
        scoringOption={pagePropsData?.scoringOption}
      />
      {page}
    </RoleBasedLayout>
  );
};
