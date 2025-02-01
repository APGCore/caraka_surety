import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import InputError from "@/components/common/input-error";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useEffect } from "react";
import EditProductTypeHeader from "./_partials/edit-product-type-header";
import { AdminEditProductTypePageProps } from "./edit-product-type.type";

const AdminEditProductTypePage: AdminEditProductTypePageProps = ({ productType }) => {
  const { data, setData, put, processing, errors, reset } = useForm({
    no: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (productType?.name || productType?.description) {
      setData({
        no: productType?.no ?? "",
        name: productType?.name ?? "",
        description: productType?.description ?? "",
      });
    }
  }, []);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route("product-types.update", productType.id), {
      onSuccess: () => {
        reset("name");
        reset("description");
      },
    });
  };

  return (
    <main className="space-y-2.5">
      <div className="border p-8 rounded-md shadow-md flex justify-center">
        <div className="w-full max-w-lg">
          <form onSubmit={submit} id="login-form" className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="no">Nomor</Label>
              <Input
                id="no"
                type="number"
                placeholder="Masukan nomor urut"
                required
                value={data.no}
                onChange={(e) => setData("no", e.target.value)}
              />
              <InputError message={errors.no} className="mt-2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                type="name"
                placeholder="Masukan nama jenis produk"
                required
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              <InputError message={errors.name} className="mt-2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                required
                value={data.description}
                placeholder="Masukan deskripsi jenis produk"
                onChange={(e) => setData("description", e.target.value)}
              />
              <InputError message={errors.description} className="mt-2" />
            </div>
            <div className="flex justify-end">
              <Button form="login-form" className="w-full max-w-[180px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                Edit Jenis Produk
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminEditProductTypePage;

AdminEditProductTypePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <EditProductTypeHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
