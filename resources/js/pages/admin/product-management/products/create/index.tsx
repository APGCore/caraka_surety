import { cn } from "@/common/utils/cn";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/_shadcn-ui/command";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/_shadcn-ui/popover";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import InputError from "@/components/molecules/input/error-input";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import axios from "axios";
import { Check, ChevronsUpDown, RotateCw } from "lucide-react";
import React, { FormEventHandler, useEffect, useMemo, useState } from "react";

const AdminCreateProductPage = () => {
  const [productTypes, setProductTypes] = useState<Array<{ id: number; name: string }>>([]);
  const [choosedProductTypes, setChoosedProductTypes] = useState<Array<{ id: any; name: string }>>([
    { id: "", name: "" },
  ]);
  const [values, setValues] = useState<Array<{ id: number; name: string }>>([{ id: 0, name: "" }]);
  const [openStates, setOpenStates] = useState<boolean[]>([]);

  const { data, setData, post, processing, errors, reset } = useForm<{
    name?: string;
    description?: string;
    productTypes?: Array<{ id: any; name: string }>;
  }>({
    name: "",
    description: "",
    productTypes: [],
  });

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

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route("products.store"), {
      onSuccess: () => {
        reset("name");
        reset("description");
        setChoosedProductTypes([{ id: "", name: "" }]);
        setValues([{ id: 0, name: "" }]);
        setOpenStates([false]);
      },
    });
  };

  const togglePopover = (index: number) => {
    setOpenStates((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return (
    <main className="space-y-2.5">
      <div className="border p-8 rounded-md shadow-md flex justify-center">
        <div className="w-full max-w-lg">
          <form onSubmit={submit} id="login-form" className="grid gap-6">
            {/* Name Input */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                type="text"
                placeholder="Masukan nama produk"
                required
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
              />
              <InputError message={errors.name} className="mt-2" />
            </div>

            {/* Description Input */}
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                required
                value={data.description}
                placeholder="Masukan deskripsi produk"
                onChange={(e) => setData("description", e.target.value)}
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

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button form="login-form" className="w-full max-w-[160px]" disabled={processing}>
                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                Tambah Produk
              </Button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default AdminCreateProductPage;

AdminCreateProductPage.layout = (page: any) => {
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
        <Button asChild>
          <Link href={route("products.create")}>Tambah Produk</Link>
        </Button>
      </div>
      {page}
    </RoleBasedLayout>
  );
};
