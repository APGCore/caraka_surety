import InputError from "@/components/common/input-error";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/layouts/admin";
import { Head, useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useEffect } from "react";
import { AdminEditProductTypePageProps } from "./edit-product-type.type";

const AdminEditProductTypePage: AdminEditProductTypePageProps = ({ productType }) => {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (productType?.name || productType?.description) {
      setData({
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
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                type="name"
                placeholder="Masukan nama jenis produk"
                required
                value={data.name}
                onChange={(e: any) => setData("name", e.target.value)}
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
                onChange={(e: any) => setData("description", e.target.value)}
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
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Products"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("products.index")}>Kelola Produk</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Tambah Produk</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{pagePropsData?.page_settings?.title}</h1>
      </div>
      {page}
    </AdminLayout>
  );
};
