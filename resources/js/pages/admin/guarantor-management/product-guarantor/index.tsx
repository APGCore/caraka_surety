import { Combobox } from "@/components/common/combobox";
import PrimaryButton from "@/components/common/primary-button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/general/use-toast";
import AdminLayout from "@/layouts/admin";
import { cn } from "@/lib/cn";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { Check, ChevronsUpDown } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { ProductGuarantorPageProps } from "./product-guarantor-page.type";

type GuarantorProductType = {
  id: number;
  no: number;
  product_id: number;
  product_type_id: number;
  code: string;
  name: string;
  job_group: string;
  job_type: string;
};

const ProductGuarantorPage: ProductGuarantorPageProps = ({ guarantors, products, jobGroups, jobTypes }) => {
  const [productActive, setProductActive] = useState<number>();
  const [showSelectProduct, setShowSelectProduct] = useState<boolean>(true);
  const [productTypes, setProductTypes] = useState<Array<GuarantorProductType>>([]);
  const [productsGuarantor, setProductsGuarantor] = useState<Array<any>>([]);
  const [guarantorSelected, setGuarantorSelected] = useState<number | null>(null);
  const [productSelected, setProductSelected] = useState<number | null>(null);
  const guarantorProductTypeDefault = {
    id: 0,
    no: 0,
    product_id: 0,
    product_type_id: 0,
    code: "",
    name: "",
    job_group: "",
    job_type: "",
  };

  const [productTypeOwnedProduct, setProductTypeOwnedProduct] = useState<Array<GuarantorProductType>>([
    guarantorProductTypeDefault,
  ]);

  const [choosedProductTypes, setChoosedProductTypes] = useState<Array<GuarantorProductType>>([
    guarantorProductTypeDefault,
  ]);
  const [values, setValues] = useState<Array<GuarantorProductType>>([guarantorProductTypeDefault]);
  const [openStates, setOpenStates] = useState<boolean[]>([]);

  useEffect(() => {
    if (productActive) {
      axios.get(route("product-types.get-by-product", productActive)).then((response) => {
        setProductTypes(response.data);
      });
    }
  }, [productActive]);

  const add = () => {
    if (!guarantorSelected || !productSelected) {
      return toast({
        title: "Gagal",
        description: "Pilih produk terlebih dahulu",
        variant: "destructive",
      });
    }
    if (productsGuarantor?.find((product: any) => product.id === productSelected)) {
      return toast({
        title: "Gagal",
        description: "Produk sudah ada di daftar",
        variant: "destructive",
      });
    }

    let data: Array<any>;
    data = productsGuarantor || [];
    const product = products.find((product: any) => product.id === productSelected);
    data.push(product);

    setProductsGuarantor(data);
    setProductSelected(null);
    selectProduct(product);
  };

  const changeGuarantor = () => {
    if (guarantorSelected) {
      axios.get(route("product-guarantor.get-by-guarantor", guarantorSelected)).then((response) => {
        if (response.data.data.productTypes) {
          const productTypes: GuarantorProductType[] = response.data.data.productTypes;
          setProductTypeOwnedProduct(productTypes);

          if (response.data.data.products.length > 0) {
            setProductsGuarantor(response.data.data.products);
            const productId: number = response.data.data.products[0].id;
            setProductActive(productId);
            const filteredProductTypes: GuarantorProductType[] = productTypes.filter(
              (data: any) => data.product_id === productId,
            );
            setValues(filteredProductTypes || [guarantorProductTypeDefault]);
            setChoosedProductTypes(filteredProductTypes || [guarantorProductTypeDefault]);
          }
        }
        setShowSelectProduct(false);
      });
    } else {
      toast({
        title: "Gagal",
        description: "Pilih asuransi terlebih dahulu",
        variant: "destructive",
      });
    }
  };

  const selectProduct = (product: any) => {
    if (productActive === product.id) return;

    setAll();

    setProductActive(product.id);
    const productTypes: GuarantorProductType[] = productTypeOwnedProduct.filter(
      (data: any) => data.product_id === product.id,
    );
    setValues(productTypes || [guarantorProductTypeDefault]);
    setChoosedProductTypes(productTypes || [guarantorProductTypeDefault]);
  };

  const removeProduct = (product: any) => {
    if (productActive === product.id) {
      setValues([]);
      setChoosedProductTypes([]);
      setProductActive(undefined);
    }

    const newProducts = productsGuarantor?.filter((data: any) => data.id !== product.id);
    setProductsGuarantor(newProducts);

    const newProductTypeOwnedProduct = productTypeOwnedProduct.filter((data: any) => data.product_id !== product.id);
    setProductTypeOwnedProduct(newProductTypeOwnedProduct);
  };

  const productFiltered = useMemo(() => {
    return products.filter((product: any) => !productsGuarantor?.some((data: any) => data.id === product.id));
  }, [products, productsGuarantor]);

  const setAll = () => {
    const newValue = productTypeOwnedProduct.filter(
      (data: any) => data.product_id !== productActive && data.product_id !== 0,
    );

    setProductTypeOwnedProduct([...newValue, ...values]);
  };

  useEffect(() => {
    setAll();
  }, [values]);

  const handleComboboxSelect = (selectedItem: any, index: number) => {
    const updatedProductTypes = choosedProductTypes[index]?.id
      ? choosedProductTypes.map((type, idx) => (idx === index ? selectedItem : type))
      : choosedProductTypes.map((type, idx) =>
          idx === index
            ? {
                ...type,
                id: selectedItem.id,
                no: selectedItem.no,
                product_id: productActive || 0,
                product_type_id: selectedItem.product_type_id,
                code: selectedItem.code,
                name: selectedItem.name,
                job_group: selectedItem.job_group,
              }
            : type,
        );

    setChoosedProductTypes(updatedProductTypes);
  };

  const addCombobox = () => {
    setChoosedProductTypes((prev: any) => [...prev, { ...guarantorProductTypeDefault, no: prev.length }]);
    setValues((prev) => [...prev, { ...guarantorProductTypeDefault, no: prev.length }]);
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

  const changeJobGroup = (value: any, id: number, val: any) => {
    const newValue = values[id].job_group === value ? "" : value;
    setValues((prev) => {
      const newValues = [...prev];
      newValues[id] = {
        id: val.id,
        no: values[id].no,
        product_id: productActive || 0,
        product_type_id: values[id].product_type_id,
        code: values[id].code,
        name: values[id].name,
        job_group: newValue == "-" ? null : newValue,
        job_type: values[id].job_type,
      };
      return newValues;
    });
  };

  const changeJobType = (value: any, id: number, val: any) => {
    const newValue = values[id].job_type === value ? "" : value;
    setValues((prev) => {
      const newValues = [...prev];
      newValues[id] = {
        id: val.id,
        no: values[id].no,
        product_id: productActive || 0,
        product_type_id: values[id].product_type_id,
        code: values[id].code,
        name: values[id].name,
        job_group: values[id].job_group,
        job_type: newValue == "-" ? null : newValue,
      };
      return newValues;
    });
  };

  const clear = () => {
    setShowSelectProduct(true);
    setProductTypeOwnedProduct([]);
    setProductsGuarantor([]);
    setProductSelected(null);
    setGuarantorSelected(null);
    setValues([guarantorProductTypeDefault]);
    setChoosedProductTypes([guarantorProductTypeDefault]);
  };

  const submit = () => {
    axios
      .post(
        route("product-guarantor.store"),
        {
          guarantor_id: guarantorSelected,
          data: productTypeOwnedProduct,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      .then((response) => {
        toast({
          title: "Berhasil",
          description: response.data.message,
          variant: "default",
        });
      })
      .catch((error) => {
        toast({
          title: "Gagal",
          description: error.response.data.message,
          variant: "destructive",
        });
      });
  };

  return (
    <main className="space-y-2.5">
      {showSelectProduct && (
        <div className="border p-8 rounded-md shadow-md flex items-center justify-center space-x-2">
          <div className="w-[30%]">
            <Combobox
              datas={guarantors}
              labelKey={"name"}
              valueKey={"name"}
              defaultValue={guarantorSelected}
              placeholder={"Pilih Asuransi"}
              onSelect={(value) => setGuarantorSelected(value.id)}
            />
          </div>
          <Button type="button" onClick={() => changeGuarantor()}>
            Pilih
          </Button>
        </div>
      )}

      {!showSelectProduct && (
        <div className="border p-8 rounded-md shadow-md">
          <div className="flex items-center mb-4 space-x-2">
            <h2 className="text-xl">{guarantors.find((item: any) => item.id == guarantorSelected)?.name}</h2>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Pilih Kembali</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                  <AlertDialogDescription>Data yang belum disimpan akan terhapus!!!.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clear}>Pilih Kembali</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div>
                <Combobox
                  datas={productFiltered}
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

            <div className="w-[180px]">
              <PrimaryButton
                onClick={submit}
                disabled={productsGuarantor?.length == 0}
                className="w-full justify-center bg-green-700 hover:bg-green-500">
                Simpan
              </PrimaryButton>
            </div>
          </div>

          {productsGuarantor?.length > 0 && (
            <div className="flex w-full">
              <div className="p-4 w-[30%]">
                <h2 className="mb-4 text-lg font-medium leading-none">Produk Guarantor</h2>
                {productsGuarantor?.map((product) => (
                  <>
                    <div className="flex align-center space-x-2">
                      <Button
                        className={cn(
                          `w-full`,
                          productActive == product.id ? "bg-green-700 hover:bg-green-500" : "hover:bg-gray-400",
                        )}
                        onClick={() => selectProduct(product)}>
                        {product.name}
                      </Button>
                      <Button
                        type="button"
                        className="bg-destructive hover:bg-destructive/80"
                        onClick={() => removeProduct(product)}>
                        Hapus
                      </Button>
                    </div>
                    <Separator className="my-2" />
                  </>
                ))}
              </div>
              <div className="p-4 pt-6 w-[70%]">
                <div className="grid gap-2 ">
                  <Label htmlFor="name">Jenis Produk</Label>
                  {choosedProductTypes.map((val, id) => (
                    <div key={id} className="space-y-2 flex items-center gap-x-2">
                      <Input
                        id="no"
                        type="number"
                        placeholder="No"
                        value={values[id]?.no}
                        className="mt-2 h-[40px] w-[15%]"
                        min={1}
                        onChange={(value) => {
                          const newValue =
                            values[id].no === parseInt(value.target.value) ? 0 : parseInt(value.target.value);
                          setValues((prev) => {
                            const newValues = [...prev];

                            newValues[id] = {
                              id: val.id,
                              product_id: productActive || 0,
                              product_type_id: values[id].product_type_id,
                              no: newValue,
                              code: values[id].code,
                              name: values[id].name,
                              job_group: values[id].job_group,
                              job_type: values[id].job_type,
                            };
                            return newValues;
                          });
                        }}
                      />
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
                              id: val.id,
                              no: values[id].no,
                              product_id: productActive || 0,
                              product_type_id: values[id].product_type_id,
                              code: newValue,
                              name: values[id].name,
                              job_group: values[id].job_group,
                              job_type: values[id].job_type,
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
                                {productTypes.map((framework) => (
                                  <CommandItem
                                    key={framework.id}
                                    onSelect={() => {
                                      const newValue = values[id].name === framework.name ? "" : framework.name;
                                      setValues((prev) => {
                                        const newValues = [...prev];
                                        newValues[id] = {
                                          id: val.id,
                                          no: values[id].no,
                                          product_id: productActive || 0,
                                          product_type_id: framework.id,
                                          code: values[id].code,
                                          name: newValue,
                                          job_group: values[id].job_group,
                                          job_type: values[id].job_type,
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

                      <Select
                        onValueChange={(value) => changeJobGroup(value, id, val)}
                        defaultValue={values[id]?.job_group}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kelompok Pekarjaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={"-"}>-</SelectItem>
                            {jobGroups.map((jobGroup: any) => (
                              <SelectItem value={jobGroup}>{jobGroup}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      <Select
                        onValueChange={(value) => changeJobType(value, id, val)}
                        defaultValue={values[id]?.job_type}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Tipe Pekarjaan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value={"-"}>-</SelectItem>
                            {jobTypes.map((groupType: any) => (
                              <SelectItem value={groupType}>{groupType}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {/* Delete Combobox Button */}
                      {choosedProductTypes.length > 1 && (
                        <Button
                          type="button"
                          className="bg-destructive hover:bg-destructive/80"
                          onClick={() => removeCombobox(id)}>
                          Hapus
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <Button type="button" className="w-full mt-4" onClick={addCombobox}>
                  Tambah Jenis Produk
                </Button>
              </div>
            </div>
          )}
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
