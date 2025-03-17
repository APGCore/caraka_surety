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
import InputError from "@/components/molecules/input/error-input";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Head, useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useState } from "react";
import { DocumentGeneralPageProps } from "../documents-general-required.page.type";

const AdminCreateDocumentPage: DocumentGeneralPageProps = ({ productTypes }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        description: "",
        product_type_id: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("document.store"), {
            onSuccess: () => {
                reset("name");
                reset("description");
                reset("product_type_id");
            },
        });
    };

    const [selectedProductType, setSelectedProductType] = useState<string>("");

    const handleProductTypeChange = (value: any) => {
        setSelectedProductType(value === "none" ? null : value);
        setData("product_type_id", value);
    };

    return (
        <main className="space-y-2.5">
            <div className="border p-8 rounded-md shadow-md flex justify-center">
                <div className="w-full max-w-lg">
                    <form onSubmit={submit} id="document-form" className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                placeholder="Masukan nama document"
                                required
                            />
                            {errors.name && <InputError message={errors.name} />}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                required
                                placeholder="Masukan deskripsi produk"
                            />
                            {errors.description && <InputError message={errors.description} />}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="product-type">Produk</Label>
                            <Select onValueChange={handleProductTypeChange} value={selectedProductType}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Produk" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">Tidak Memilih</SelectItem>
                                    {productTypes.map((productType) => (
                                        <SelectItem key={productType.id} value={productType.id.toString()}>
                                            {productType.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.product_type_id && <InputError message={errors.product_type_id} />}
                        </div>

                        <div className="flex justify-end">
                            <Button form="document-form" className="w-full max-w-[140px]" disabled={processing}>
                                {processing && <RotateCw className="animate-spin mr-2" />}
                                Tambah Dokumen
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default AdminCreateDocumentPage;

AdminCreateDocumentPage.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
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
        </RoleBasedLayout>
    );
};
