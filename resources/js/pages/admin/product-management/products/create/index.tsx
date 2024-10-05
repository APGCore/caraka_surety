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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/layouts/admin";
import { Head, useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler } from "react";
import { AdminProductsPageProps } from "../admin-products-page.type";

const AdminCreateProductsPage: AdminProductsPageProps = () => {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("login"), {
      onSuccess: () => {
        reset("email");
        reset("password");
      },
    });
  };

  return (
    <main className="space-y-2.5">
      <div className="border p-8 rounded-md shadow-md flex justify-center">
        <div className="w-full max-w-lg">
          <form onSubmit={submit} id="login-form" className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Nama</Label>
              <Input
                id="email"
                type="email"
                placeholder="Masukan nama produk"
                required
                value={data.email}
                onChange={(e: any) => setData("email", e.target.value)}
              />
              <InputError message={errors.email} className="mt-2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Deskripsi</Label>
              <Textarea
                id="password"
                required
                value={data.password}
                placeholder="Masukan deskripsi produk"
                onChange={(e: any) => setData("password", e.target.value)}
              />
              <InputError message={errors.password} className="mt-2" />
            </div>
            <div className="flex justify-end">
              <Button form="login-form" className="w-full max-w-[140px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2" />}
                Tambah Produk
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminCreateProductsPage;

AdminCreateProductsPage.layout = (page: any) => {
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
