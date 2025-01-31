import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import InputError from "@/components/common/input-error";
import AdminLayout from "@/layouts/admin";
import { Head, useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import { AdminEditDocumentReqPageProps } from "./edit-required-doc.type";

const AdminEditDocumentReqPage: AdminEditDocumentReqPageProps = ({ reqDoc, productType }) => {
  const { data, setData, put, processing, errors, reset } = useForm({
    name: reqDoc?.name || "",
    description: reqDoc?.description || "",
    product_type_id: "",
  });

  useEffect(() => {
    if (reqDoc) {
      setData({
        name: reqDoc.name ?? "",
        description: reqDoc.description ?? "",
        product_type_id: reqDoc.product_type_id ?? "",
      });
    }
  }, [reqDoc]);

  useEffect(() => {
    if (data.product_type_id) {
      setSelectedProductType(data.product_type_id.toString());
    }
  }, [data.product_type_id]);

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route("document.update", reqDoc.id), {
      onSuccess: () => {
        reset();
      },
    });
  };

  //   const handleProductTypeChange = (value: string) => {
  //     setData("product_type_id", value);
  //   };

  const [selectedProductType, setSelectedProductType] = useState<string>("");

  const handleProductTypeChange = (value: any) => {
    setSelectedProductType(value === "none" ? null : value);
    setData("product_type_id", value);
  };

  return (
    <main className="space-y-2.5">
      <div className="border p-8 rounded-md shadow-md flex justify-center">
        <div className="w-full max-w-lg">
          <form onSubmit={submit} id="edit-document-form" className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukan nama dokumen"
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
                placeholder="Masukan deskripsi dokumen"
                onChange={(e) => setData("description", e.target.value)}
              />
              <InputError message={errors.description} className="mt-2" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product-type">Produk</Label>
              <Select onValueChange={handleProductTypeChange} value={selectedProductType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Produk" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">Tidak Memilih</SelectItem>
                  {productType?.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.product_type_id && <InputError message={errors.product_type_id} />}
            </div>

            <div className="flex justify-end">
              <Button form="edit-document-form" className="w-full max-w-[160px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                Update Data
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminEditDocumentReqPage;

AdminEditDocumentReqPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Edit Dokumen"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("document.index")}>Kelola Dokumen</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit Dokumen</BreadcrumbPage>
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
