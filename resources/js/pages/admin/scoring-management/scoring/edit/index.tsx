import InputError from "@/components/common/input-error";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/layouts/admin";
import { getNumericValue } from "@/lib/getNumericValue";
import { useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useEffect } from "react";
import EditScoringHeader from "./_partials/edit-scoring-header";
import { AdminEditScoringPageProps } from "./edit-scoring.type";

const AdminEditScoringPage: AdminEditScoringPageProps = ({ scoring }) => {
  const { data, setData, put, processing, errors, reset } = useForm<{
    name: string;
    min_point: number | undefined;
  }>({
    name: "",
    min_point: undefined,
  });

  useEffect(() => {
    if (scoring?.name || scoring?.min_point) {
      setData({
        name: scoring?.name ?? "",
        min_point: scoring?.min_point ?? undefined,
      });
    }
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route("scoring.update", scoring.id), {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <main className="space-y-2.5">
      <div className="border p-8 rounded-md shadow-md flex justify-center">
        <div className="w-full max-w-lg">
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
              <Label htmlFor="min_point">Poin Minimal</Label>
              <Input
                id="min_point"
                type="number"
                required
                value={data.min_point}
                placeholder="Masukan poin minimal"
                onChange={(e) => setData("min_point", getNumericValue(e))}
              />
              <InputError message={errors.min_point} className="mt-2" />
            </div>
            <div className="flex justify-end">
              <Button form="skoring-form" className="w-full max-w-[200px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                Edit Skoring
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminEditScoringPage;

AdminEditScoringPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <EditScoringHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </AdminLayout>
  );
};
