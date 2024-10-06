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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/layouts/admin";
import { cn } from "@/lib/cn";
import { Head, useForm } from "@inertiajs/react";
import axios from "axios";
import { Check, ChevronsUpDown, RotateCw } from "lucide-react";
import { FormEventHandler, useEffect, useMemo, useState } from "react";
import { AdminEditProductPageProps } from "./edit-product.type";

const AdminEditProductPage: AdminEditProductPageProps = ({ product, product_types }) => {
  const [productTypes, setProductTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [choosedProductTypes, setChoosedProductTypes] = useState<Array<{ id: any; name: string }>>([
    { id: "", name: "" },
  ]);
  const [values, setValues] = useState<Array<{ id: number; name: string }>>([{ id: 0, name: "" }]);
  const [openStates, setOpenStates] = useState<boolean[]>([]);

  const { data, setData, put, processing, errors, reset } = useForm<{
    name?: string;
    description?: string;
    productTypes?: Array<{ id: any; name: string }>;
  }>({
    name: "",
    description: "",
    productTypes: [],
  });

  console.log({
    product,
    product_types,
  });

  useEffect(() => {
    if (product?.name || product?.description) {
      if (product_types?.length > 0) {
        const productTypes = product_types.map((productType: any) => ({
          id: productType.id,
          name: productType.name,
        }));
        setData({
          name: product?.name ?? "",
          description: product?.description ?? "",
          productTypes: productTypes,
        });
        setChoosedProductTypes(productTypes);
        setValues(productTypes);
      } else {
        setData({
          name: product?.name ?? "",
          description: product?.description ?? "",
          productTypes: [],
        });
      }
    }
  }, []);

  useEffect(() => {
    axios
      .get(route("product-types.all"))
      .then((response) => {
        setProductTypes(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const selectedProductTypes = useMemo(() => {
    return productTypes.map((productType) => ({
      ...productType,
      isChoosed: choosedProductTypes.some((choosedType) => choosedType.id === productType.id),
    }));
  }, [productTypes, choosedProductTypes]);

  const handleComboboxSelect = (selectedItem: any, index: number) => {
    const updatedProductTypes = choosedProductTypes[index]?.id
      ? choosedProductTypes.map((type, idx) => (idx === index ? selectedItem : type))
      : choosedProductTypes.map((type, idx) =>
          idx === index ? { ...type, id: selectedItem.id, name: selectedItem.name } : type,
        );

    setChoosedProductTypes(updatedProductTypes);
    setData({
      ...data,
      productTypes: updatedProductTypes,
    });
  };

  const addCombobox = () => {
    setChoosedProductTypes((prev) => [...prev, { id: "", name: "" }]);
    setValues((prev) => [...prev, { id: prev.length, name: "" }]);
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
    setData({
      ...data,
      productTypes: updatedProductTypes,
    });
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

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    put(route("products.update", product.id), {
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
                placeholder="Masukan nama produk"
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
                placeholder="Masukan deskripsi produk"
                onChange={(e: any) => setData("description", e.target.value)}
              />
              <InputError message={errors.description} className="mt-2" />
            </div>
            {/* Dynamically Added Comboboxes */}
            <div className="grid gap-2">
              <Label htmlFor="name">Jenis Produk</Label>
              {choosedProductTypes.map((val, id) => (
                <div key={id} className="space-y-2 flex items-center gap-x-2">
                  <Popover open={openStates[id]} onOpenChange={() => togglePopover(id)}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openStates[id]}
                        className="w-full justify-between">
                        {values[id]?.name || "Select framework..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
                      <Command>
                        <CommandInput placeholder="Search framework..." />
                        <CommandList>
                          <CommandEmpty>No framework found.</CommandEmpty>
                          <CommandGroup>
                            {selectedProductTypes.map((framework) => (
                              <CommandItem
                                key={framework.id}
                                disabled={framework.isChoosed}
                                onSelect={() => {
                                  const newValue = values[id].name === framework.name ? "" : framework.name;
                                  setValues((prev) => {
                                    const newValues = [...prev];
                                    newValues[id] = { id: id, name: newValue };
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
                  {/* Delete Combobox Button */}
                  {choosedProductTypes.length > 1 && (
                    <Button type="button" onClick={() => removeCombobox(id)}>
                      Delete
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Button to Add New Combobox */}
            <Button type="button" onClick={addCombobox}>
              Tambah Jenis Produk
            </Button>
            <div className="flex justify-end">
              <Button form="login-form" className="w-full max-w-[160px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                Edit Produk
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminEditProductPage;

AdminEditProductPage.layout = (page: any) => {
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
