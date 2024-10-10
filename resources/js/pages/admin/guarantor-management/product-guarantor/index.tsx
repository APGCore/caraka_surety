import { Combobox } from "@/components/common/combobox";
import PrimaryButton from "@/components/common/primary-button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/layouts/admin";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { ProductGuarantorPageProps } from "./product-guarantor-page.type";

const AdminProductsPage: ProductGuarantorPageProps = ({ guarantors, products }) => {
  const [productTypes, setProductTypes] = useState([]);
  const [productsGuarantor, setProductsGuarantor] = useState<Array<any>>([]);
  const [productTypesGuarantor, setProductTypesGuarantor] = useState();
  const [guarantorSelected, setGuarantorSelected] = useState();
  const [productSelected, setProductSelected] = useState();

  useEffect(() => {
    if (productSelected) {
      axios.get(route("product-types.get-by-product", productSelected)).then((response) => {
        setProductTypes(response.data);
      });
    }
  }, [productSelected]);

  const add = () => {
    if (!guarantorSelected || !productSelected) {
      return toast({
        title: "Gagal",
        description: "Pilih penjamin, dan produk terlebih dahulu",
        variant: "destructive",
      });
    }
    const data = [...productsGuarantor, products.find((product: any) => product.id === productSelected)];

    setProductsGuarantor(data);
    setProductSelected(undefined);

    console.log(productsGuarantor);
  };

  return (
    <main className="space-y-2.5">
      <div className="flex items-center space-x-2.5">
        <div>
          <Combobox
            datas={guarantors}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={guarantorSelected}
            placeholder={"Pilih Penjamin"}
            className={"w-[210px]"}
            onSelect={(value) => setGuarantorSelected(value.id)}
          />
        </div>

        <div>
          <Combobox
            datas={products}
            labelKey={"name"}
            valueKey={"name"}
            defaultValue={productSelected}
            placeholder={"Pilih Produk"}
            className={"w-[210px]"}
            onSelect={(value) => setProductSelected(value.id)}
          />
        </div>

        <div>
          <PrimaryButton onClick={add}>Tambah</PrimaryButton>
        </div>
      </div>

      <div></div>
    </main>
  );
};

export default AdminProductsPage;

AdminProductsPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Products"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={route("guarantor.index")}>Kelola Pihak Terkait</BreadcrumbLink>
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
