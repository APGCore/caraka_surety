import { getNumericValue } from "@/common/utils/get-numeric-value";
import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Combobox } from "@/components/molecules/combobox";
import InputError from "@/components/molecules/input/error-input";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import CreateScoringQuestionCategoryHeader from "./_partials/create-scoring-question-category-header";

const AdminCreateSkoringQuestionCategoryPage = () => {
  const [scorings, setScorings] = useState([]);

  const { data, setData, post, processing, errors, reset } = useForm<{
    name: string;
    max_point: number | undefined;
    scoring_id: string;
  }>({
    name: "",
    max_point: undefined,
    scoring_id: "",
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

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("scoring-question-category.store"), {
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
                placeholder="Masukan nama skoring"
                required
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="max_point">Poin Maksimal</Label>
              <Input
                id="max_point"
                type="number"
                required
                placeholder="Masukan poin maksimal"
                onChange={(e) => setData("max_point", getNumericValue(e))}
              />
              <InputError message={errors.max_point} className="mt-2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="scoring_id">Skoring</Label>
              <Combobox
                datas={scorings}
                labelKey={"name"}
                valueKey={"name"}
                placeholder={"Pilih Skoring"}
                onSelect={(value) => {
                  setData("scoring_id", value?.id);
                }}
              />
              <InputError message={errors.scoring_id} className="mt-2" />
            </div>
            <div className="flex justify-end">
              <Button form="skoring-form" className="w-full max-w-[270px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                Tambah Kategori Pertanyaan Skoring
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminCreateSkoringQuestionCategoryPage;

AdminCreateSkoringQuestionCategoryPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <CreateScoringQuestionCategoryHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
