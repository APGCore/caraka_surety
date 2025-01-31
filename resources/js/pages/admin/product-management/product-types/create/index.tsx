import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import InputError from "@/components/common/input-error";
import AdminLayout from "@/layouts/admin";
import { useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler } from "react";
import CreateProductTypeHeader from "./_partials/create-product-type-header";

const AdminCreateProductTypePage = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    no: "",
    name: "",
    description: "",
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("product-types.store"), {
      onSuccess: () => {
        reset("no");
        reset("name");
        reset("description");
      },
    });
  };

  return (
    <main className="space-y-2.5">
      <div className="border p-12 rounded-md shadow-md flex justify-center">
        <div className="w-full max-w-lg ">
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
              <Button form="login-form" className="w-full max-w-[200px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                Tambah Jenis Produk
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminCreateProductTypePage;

AdminCreateProductTypePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <CreateProductTypeHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </AdminLayout>
  );
};
