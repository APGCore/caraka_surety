import NewCombobox from "@/_features/_common/components/combobox";
import { Roles } from "@/_features/_common/types/roles";
import { OfficeData, useSearchOffice } from "@/_features/office/services/office-query";
import { Button } from "@/components/_shadcn-ui/button";
import { Input, PasswordInput } from "@/components/_shadcn-ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_shadcn-ui/select";
import PrimaryButton from "@/components/atoms/button/primary-button";
import SecondaryButton from "@/components/atoms/button/secondary-button";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import InputError from "@/components/molecules/input/error-input";
import { router, useForm } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useMemo, useState } from "react";

interface Props {
  officeSelected: number;
  isHeadquarter: boolean;
  role?: any;
  roles: any;
  roles_names: Roles;
  headers: any;
  employee?: any;
  routeName: any;
}

const Form: React.FC<Props> = ({ officeSelected, isHeadquarter, roles, roles_names, headers, employee, routeName }) => {
  const { data, setData, post, patch, errors, processing } = useForm<{
    name: string;
    username: string;
    email: string;
    phone: string;
    head_id: number | null;
    role_id: number | null;
    profile_id: number;
    password: string;
    password_confirmation: string;
    office_monitorings: any[];
  }>({
    name: employee?.name || "",
    username: employee?.username || "",
    email: employee?.email || "",
    phone: employee?.phone || "",
    head_id: employee?.head_id || null,
    role_id: employee?.role_id || null,
    profile_id: officeSelected,
    password: employee?.password || "",
    password_confirmation: employee?.password || "",
    office_monitorings: employee?.office_monitorings
      ? employee.office_monitorings.map((office: any) => ({
          office_monitoring_id: office.pivot?.id,
          office_id: office.id,
          name: office.name,
        }))
      : [],
  });

  // pairing banks
  const { data: office, isLoading: isLoadingOffice } = useSearchOffice({
    officeType: "Kantor Cabang",
  });

  const [selectedOffice, setSelectedOffice] = useState<OfficeData[]>([]);

  const officeList = useMemo(() => {
    if (!isLoadingOffice && Array.isArray(office)) {
      return office.map((item: OfficeData) => ({
        id: item.id,
        name: item.name,
        isChoosed: selectedOffice.some((selected: OfficeData): boolean => selected.id === item.id),
      }));
    }
    return [];
  }, [office, isLoadingOffice]);

  const handleSelectOffice = (val: OfficeData) => {
    if (!val) return;
    setData("office_monitorings", [
      ...data.office_monitorings,
      {
        office_monitoring_id: val.pivot?.id,
        office_id: val.id,
        name: val.name,
      },
    ]);
    setSelectedOffice([...selectedOffice, val]);
  };

  // Render selected guarantors
  const renderSelectedOffices = useMemo(() => {
    return selectedOffice.map((office: OfficeData) => (
      <div key={office.id} className="flex items-center justify-between p-1 text-sm pl-2 border rounded-md">
        <div className="flex items-center gap-2">
          <span className="font-medium">{office.name}</span>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            const newSelectedOffice = selectedOffice.filter((g) => g.id !== office.id);

            setSelectedOffice(newSelectedOffice);
            setData("office_monitorings", newSelectedOffice);
          }}>
          Hapus
        </Button>
      </div>
    ));
  }, [selectedOffice]);

  const submitForm: FormEventHandler<HTMLFormElement> = (event: any) => {
    event.preventDefault();
    if (!employee) {
      post(route("employee.store"), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          router.get(route(`${routeName}.index`, { office_id: officeSelected }));
        },
      });
    } else {
      patch(route("employee.update", employee.id), {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          router.get(route(`${routeName}.index`, { office_id: officeSelected }));
        },
      });
    }
  };
  return (
    <form onSubmit={submitForm} className="mt-6 space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nama
          </label>
          <Input
            type="text"
            name="name"
            id="name"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          <InputError message={errors.name} className="mt-2" />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            type="text"
            name="username"
            id="username"
            value={data.username}
            onChange={(e) => setData("username", e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          <InputError message={errors.username} className="mt-2" />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          <InputError message={errors.email} className="mt-2" />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            No Telepon
          </label>
          <Input
            type="text"
            name="phone"
            id="phone"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
            autoComplete="phone"
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          <InputError message={errors.phone} className="mt-2" />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>

          <Select
            value={data?.role_id?.toString() || ""}
            onValueChange={(value) => {
              setData((prev) => ({
                ...prev,
                role_id: parseInt(value),
                ...(parseInt(value) == 5 && { head_id: null }),
              }));
              router.visit(route(`${routeName}.${employee ? `edit` : "create"}`, employee?.id), {
                data: { role_id: value, office_id: officeSelected },
                preserveState: true,
              });
            }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <RenderList
                  of={roles}
                  render={(role: any) => <SelectItem value={role.id.toString()}>{role.name}</SelectItem>}
                />
              </SelectGroup>
            </SelectContent>
          </Select>

          <InputError message={errors.role_id} className="mt-2" />
        </div>
        <Show when={headers.length > 0}>
          <div className="sm:col-span-3">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Atasan
            </label>
            <Select
              value={data?.head_id?.toString() || ""}
              onValueChange={(value) => {
                setData("head_id", parseInt(value));
              }}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Atasan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <RenderList
                    of={headers}
                    render={(header: any) => (
                      <SelectItem key={header.id} value={header.id.toString()}>
                        {header.name}
                      </SelectItem>
                    )}
                  />
                </SelectGroup>
              </SelectContent>
            </Select>
            <InputError message={errors.head_id} className="mt-2" />
          </div>
        </Show>
        <div className="sm:col-span-3">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <PasswordInput
            name="password"
            id="password"
            value={data.password}
            onChange={(e) => setData("password", e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />

          <InputError message={errors.password} className="mt-2" />
        </div>
        <div className="sm:col-span-3">
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
            Konfirmasi Password
          </label>
          <PasswordInput
            name="password_confirmation"
            id="password_confirmation"
            value={data.password_confirmation}
            onChange={(e) => setData("password_confirmation", e.target.value)}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
          />
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <Show
          when={
            isHeadquarter &&
            (employee?.role?.name === roles_names?.Staff ||
              employee?.role?.name === roles_names?.Manager ||
              employee?.role?.name === roles_names?.Direksi)
          }>
          <div className="sm:col-span-6">
            <p className="text-lg font-bold uppercase underline underline-offset-4 mb-3">Monitor Unit Bisnis</p>
            <NewCombobox
              isDisabled={!isLoadingOffice && Array.isArray(office) && selectedOffice.length === office?.length}
              data={officeList}
              valueKey="id"
              labelKey="name"
              filterKey="isChoosed"
              isLoading={isLoadingOffice}
              placeholder="Pilih Unit Bisnis"
              onSelect={(val: any) => {
                handleSelectOffice(val);
              }}
            />
            {selectedOffice.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-sm font-bold">Unit Bisnis yang dipilih</span>
                {renderSelectedOffices}
              </div>
            )}
          </div>
        </Show>
      </div>

      <div className="flex justify-end">
        <SecondaryButton
          type="button"
          className="mr-3"
          onClick={() => router.get(route(`${routeName}.index`) + "?office_id=" + officeSelected)}>
          Batal
        </SecondaryButton>
        <PrimaryButton type="submit">
          {processing && <RotateCw className="animate-spin mr-2" />}
          Simpan
        </PrimaryButton>
      </div>
    </form>
  );
};

export default Form;
