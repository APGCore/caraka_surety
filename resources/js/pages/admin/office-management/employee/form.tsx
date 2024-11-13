import InputError from "@/components/common/input-error";
import PrimaryButton from "@/components/common/primary-button";
import RenderList from "@/components/common/render-list";
import SecondaryButton from "@/components/common/secondary-button";
import { Input, PasswordInput } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { router } from "@inertiajs/react";
import { RotateCw } from "lucide-react";
import { FormEventHandler } from "react";

interface Props {
  officeSelected: number;
  submitForm: FormEventHandler<HTMLFormElement>;
  data: any;
  setData: any;
  errors: any;
  processing: any;
  roles: any;
  managers: any;
}

const Form: React.FC<Props> = ({ officeSelected, submitForm, data, setData, errors, roles, managers, processing }) => {
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

          <select
            id="role"
            name="role"
            onChange={(e) => {
              setData({
                role_id: parseInt(e.target.value),
                ...(parseInt(e.target.value) == 5 && { head_id: null }),
              });
            }}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="">Pilih Role</option>
            {roles.map((role: any) => (
              <option key={role.id} value={role.id} selected={role.id === data.role_id}>
                {role.name}
              </option>
            ))}
          </select>

          <InputError message={errors.role_id} className="mt-2" />
        </div>
        <div className="sm:col-span-3">
          {data.role_id == 5 && (
            <>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Manager
              </label>
              <Select
                value={data?.head_id?.toString() || ""}
                onValueChange={(value) => {
                  setData("head_id", value);
                }}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <RenderList
                      of={managers}
                      render={(manager: any) => (
                        <SelectItem key={manager.id} value={manager.id.toString()}>
                          {manager.name}
                        </SelectItem>
                      )}
                    />
                  </SelectGroup>
                </SelectContent>
              </Select>

              <InputError message={errors.head_id} className="mt-2" />
            </>
          )}
        </div>
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
      </div>

      <div className="flex justify-end">
        <SecondaryButton
          type="button"
          className="mr-3"
          onClick={() => router.get(route("employee.index") + "?office_id=" + officeSelected)}>
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
