import { Combobox } from "@/components/common/combobox";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import AdminLayout from "@/layouts/admin";
import { cn } from "@/lib/cn";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { ProductGuarantorPageProps } from "./product-guarantor-page.type";

const ProductGuarantorPage: ProductGuarantorPageProps = ({ guarantors, products }) => {
  const [active, setActive] = useState();
  const [productTypes, setProductTypes] = useState([]);
  const [productsGuarantor, setProductsGuarantor] = useState<Array<any>>([]);
  const [guarantorSelected, setGuarantorSelected] = useState(null);
  const [productSelected, setProductSelected] = useState(null);
  const [guarantorProductTypes, setGuarantorProductTypes] = useState<Array<any>>();
  const [productTypeOwnedProduct, setProductTypeOwnedProduct] = useState<
    Array<{
      product_id: number;
      product_types: Array<{
        id: number;
        code: string;
        product_type_id: number;
        name: string;
        kelompok_pekerjaan: string;
      }>;
    }>
  >([]);

  const [choosedProductTypes, setChoosedProductTypes] = useState<
    Array<{ id: number; code: string; product_type_id: number; name: string; kelompok_pekerjaan: string }>
  >([{ id: 0, code: "", product_type_id: 0, name: "", kelompok_pekerjaan: "" }]);
  const [values, setValues] = useState<
    Array<{
      id: number;
      code: string;
      product_type_id: number;
      name: string;
      kelompok_pekerjaan: string;
    }>
  >([{ id: 0, code: "", product_type_id: 0, name: "", kelompok_pekerjaan: "" }]);
  const [openStates, setOpenStates] = useState<boolean[]>([]);

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
        description: "Pilih penjamin dan produk terlebih dahulu",
        variant: "destructive",
      });
    }
    if (productsGuarantor.find((product: any) => product.id === productSelected)) {
      return toast({
        title: "Gagal",
        description: "Produk sudah ada di daftar",
        variant: "destructive",
      });
    }

    let data: Array<any>;
    data = productsGuarantor;
    const product = products.find((product: any) => product.id === productSelected);
    data.push(product);

    setProductsGuarantor(data);
    setProductSelected(null);
    selectProduct(product);
  };

  const changeGuarantor = (guarantor: any) => {
    if (guarantorSelected === guarantor.id) return;

    setGuarantorProductTypes((prev: any) => {
      const newValues = Array.isArray(prev) ? [...prev] : [];
      return (newValues[guarantor.id] = productTypeOwnedProduct);
    });

    setGuarantorSelected(guarantor.id);
    setValues([{ id: 0, code: "", product_type_id: 0, name: "", kelompok_pekerjaan: "" }]);
    setChoosedProductTypes([{ id: 0, code: "", product_type_id: 0, name: "", kelompok_pekerjaan: "" }]);

    setProductsGuarantor([]);
    setProductTypeOwnedProduct([]);
    setProductSelected(null);
  };

  const selectProduct = (product: any) => {
    if (active === product.id) return;

    const newValue = productTypeOwnedProduct.filter((data: any) => data.product_id !== active && data.product_id !== 0);

    setProductTypeOwnedProduct([
      ...newValue,
      {
        product_id: active || 0,
        product_types: values,
      },
    ]);

    setActive(product.id);
    const productTypes = productTypeOwnedProduct.find((data: any) => data.product_id === product.id)?.product_types;
    setValues(productTypes || [{ id: 0, code: "", product_type_id: 0, name: "", kelompok_pekerjaan: "" }]);
    setChoosedProductTypes(productTypes || [{ id: 0, code: "", product_type_id: 0, name: "", kelompok_pekerjaan: "" }]);
  };

  const selectedProductTypes = useMemo(() => {
    return productTypes.map((dataProductType: any) => ({
      ...dataProductType,
    }));
  }, [productTypes, choosedProductTypes]);

  const handleComboboxSelect = (selectedItem: any, index: number) => {
    const updatedProductTypes = choosedProductTypes[index]?.id
      ? choosedProductTypes.map((type, idx) => (idx === index ? selectedItem : type))
      : choosedProductTypes.map((type, idx) =>
          idx === index
            ? {
                ...type,
                id: selectedItem.id,
                code: selectedItem.code,
                name: selectedItem.name,
                kelompok_pekerjaan: selectedItem.kelompok_pekerjaan,
              }
            : type,
        );

    setChoosedProductTypes(updatedProductTypes);
  };

  const addCombobox = () => {
    setChoosedProductTypes((prev: any) => [...prev, { id: "", code: "", name: "", kelompok_pekerjaan: "" }]);
    setValues((prev) => [
      ...prev,
      {
        id: prev.length,
        code: "",
        product_type_id: 0,
        name: "",
        kelompok_pekerjaan: "",
      },
    ]);
    setOpenStates((prev) => [...prev, false]);
  };

  const removeCombobox = (index: number) => {
    // Create a new array of product types without the item at the specified index
    const updatedProductTypes = choosedProductTypes.filter((_, idx) => idx !== index);
    const updatedValues = values.filter((_, idx) => idx !== index);

    // Create a new array of open states without the item at the specified index
    const updatedOpenStates = openStates.filter((_, idx) => idx !== index);

    // Update state with the new arrays
    setChoosedProductTypes(updatedProductTypes);
    setValues(updatedValues);
    setOpenStates(updatedOpenStates);
  };

  const togglePopover = (index: number) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const submit = () => {
    // axios.post(route("product-guarantor.store"), {
    //   guarantor_id: guarantorSelected,
    //   product_id: active,
    //   product_types: productTypesGuarantor,
    // });
    console.log("submit");
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
            onSelect={(value) => changeGuarantor(value)}
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

      {productsGuarantor.length > 0 && (
        <div className="flex w-full">
          <div className="p-4 w-[30%]">
            <h2 className="mb-4 text-lg font-medium leading-none">Produk Guarantor</h2>
            {productsGuarantor.map((product) => (
              <>
                <SecondaryButton
                  className={`w-full ${active === product.id ? "bg-gray-400" : ""} hover:bg-gray-400`}
                  onClick={() => selectProduct(product)}>
                  {product.name}
                </SecondaryButton>
                <Separator className="my-2" />
              </>
            ))}
          </div>
          <div className="p-4 pt-6 w-[70%]">
            <form onSubmit={submit} className="grid gap-6 mx-5">
              <div className="grid gap-2 ">
                <Label htmlFor="name">Jenis Produk</Label>
                {choosedProductTypes.map((val, id) => (
                  <div key={id} className="space-y-2 flex items-center gap-x-2">
                    <Input
                      id="code"
                      type="text"
                      placeholder="Kode"
                      value={values[id]?.code}
                      className="mt-2 h-[40px] w-[30%]"
                      onChange={(value) => {
                        const newValue = values[id].code === value.target.value ? "" : value.target.value;
                        setValues((prev) => {
                          const newValues = [...prev];
                          newValues[id] = {
                            id: id,
                            code: newValue,
                            product_type_id: values[id].product_type_id,
                            name: values[id].name,
                            kelompok_pekerjaan: values[id].kelompok_pekerjaan,
                          };
                          return newValues;
                        });
                      }}
                    />
                    <Popover open={openStates[id]} onOpenChange={() => togglePopover(id)}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openStates[id]}
                          className="w-full justify-between">
                          {values[id]?.name || "Pilih Jenis Produk..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                        <Command>
                          <CommandInput placeholder="Search framework..." />
                          <CommandList>
                            <CommandEmpty>Jenis Produk tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {selectedProductTypes.map((framework) => (
                                <CommandItem
                                  key={framework.id}
                                  onSelect={() => {
                                    const newValue = values[id].name === framework.name ? "" : framework.name;
                                    setValues((prev) => {
                                      const newValues = [...prev];
                                      newValues[id] = {
                                        id: id,
                                        code: values[id].code,
                                        product_type_id: framework.id,
                                        name: newValue,
                                        kelompok_pekerjaan: values[id].kelompok_pekerjaan,
                                      };
                                      return newValues;
                                    });
                                    handleComboboxSelect(framework, id);
                                    togglePopover(id);
                                  }}>
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      values[id]?.name === framework.name ? "opacity-100" : "opacity-0",
                                    )}
                                  />
                                  {framework.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <Input
                      id="kelompok_pekerjaan"
                      type="text"
                      placeholder="Kelompok Pekerjaan"
                      value={values[id]?.kelompok_pekerjaan}
                      className="mt-2 h-[40px]"
                      onChange={(value) => {
                        const newValue = values[id].kelompok_pekerjaan === value.target.value ? "" : value.target.value;
                        setValues((prev) => {
                          const newValues = [...prev];
                          newValues[id] = {
                            id: id,
                            code: values[id].code,
                            product_type_id: values[id].product_type_id,
                            name: values[id].name,
                            kelompok_pekerjaan: newValue,
                          };
                          return newValues;
                        });
                      }}
                    />
                    {/* Delete Combobox Button */}
                    {choosedProductTypes.length > 1 && (
                      <Button type="button" onClick={() => removeCombobox(id)}>
                        Delete
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Button type="button" onClick={addCombobox}>
                Tambah Jenis Produk
              </Button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductGuarantorPage;

ProductGuarantorPage.layout = (page: any) => {
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
