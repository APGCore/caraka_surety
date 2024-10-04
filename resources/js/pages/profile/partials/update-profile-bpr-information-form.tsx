import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import TextInput from "@/components/common/text-input";
import { Textarea } from "@/components/ui/textarea";
import { Transition } from "@headlessui/react";
import { router, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function UpdateProfileBprInformation({
  provinces,
  regencies,
  districts,
  profile,
  className = "",
}: {
  provinces: Array<object>;
  regencies: Array<object>;
  districts: Array<object>;
  profile: any;
  className?: string;
}) {
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<{
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    province_id?: number | null;
    regency_id?: number | null;
    district_id?: number | null;
    village_id?: number | null;
    postal_code?: string;
  }>({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    province_id: profile.province_id,
    regency_id: profile.regency_id,
    district_id: profile.district_id,
    village_id: profile.village_id,
    postal_code: profile.postal_code,
  });

  const selectProvince = (value: any) => {
    setData((previousData) => {
      return {
        ...previousData,
        province_id: value.id,
        regency_id: null,
        district_id: null,
      };
    });

    router.get(
      route("profile.edit"),
      {
        province_id: value.id,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const selectRegency = (value: any) => {
    setData((previousData) => {
      return {
        ...previousData,
        regency_id: value.id,
        district_id: null,
      };
    });

    router.get(
      route("profile.edit"),
      {
        province_id: data.province_id,
        regency_id: value.id,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const selectDistrict = (value: any) => {
    setData((previousData) => {
      return {
        ...previousData,
        district_id: value.id,
      };
    });

    router.get(
      route("profile.edit"),
      {
        province_id: data.province_id,
        regency_id: data.regency_id,
        district_id: value.id,
      },
      {
        preserveScroll: true,
        preserveState: true,
      },
    );
  };

  const cancel = () => {
    router.get(route("profile.edit"), {});
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    patch(route("profile.update.bpr"));
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Informasi Pusat</h2>

        <p className="mt-1 text-sm text-gray-600">Untuk memperbarui informasi perusahaan BPR pusat</p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="name" value="Nama" />

          <TextInput
            id="name"
            className="mt-1 block w-full"
            value={data.name}
            onChange={(e) => setData("name", e.target.value)}
            required
            isFocused
            autoComplete="name"
          />

          <InputError className="mt-2" message={errors.name} />
        </div>

        <div>
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            className="mt-1 block w-full"
            value={data.email}
            onChange={(e) => setData("email", e.target.value)}
            required
            isFocused
            autoComplete="email"
          />

          <InputError className="mt-2" message={errors.email} />
        </div>

        <div>
          <InputLabel htmlFor="phone" value="Telepon" />

          <TextInput
            id="phone"
            className="mt-1 block w-full"
            value={data.phone}
            onChange={(e) => setData("phone", e.target.value)}
            required
            isFocused
            autoComplete="phone"
          />

          <InputError className="mt-2" message={errors.phone} />
        </div>

        <div>
          <InputLabel htmlFor="address" value="Alamat" />

          <Textarea
            id="address"
            className="mt-1 block w-full"
            value={data.address}
            onChange={(e) => setData("address", e.target.value)}
            required
            autoComplete="address"
          />

          <InputError className="mt-2" message={errors.address} />
        </div>

        <div>
          <InputLabel htmlFor="province_id" value="Provinsi" />

          <Combobox
            datas={provinces}
            labelKey="name"
            valueKey="id"
            defaultValue={data.province_id ?? ""}
            onSelect={(value) => selectProvince(value)}
            placeholder="Pilih Provinsi..."
            notFoundText="Provinsi tidak ditemukan."
            className="mt-1 w-full"
          />

          <InputError className="mt-2" message={errors.province_id} />
        </div>

        <div>
          <InputLabel htmlFor="regency_id" value="Kabupaten/Kota" />

          <Combobox
            datas={regencies}
            labelKey="name"
            valueKey="id"
            defaultValue={data.regency_id ?? ""}
            onSelect={(value) => selectRegency(value)}
            placeholder="Pilih Kabupaten/Kota..."
            notFoundText="Kabupaten/Kota tidak ditemukan."
            className="mt-1 w-full"
          />

          <InputError className="mt-2" message={errors.regency_id} />
        </div>

        <div>
          <InputLabel htmlFor="district_id" value="Kecamatan" />

          <Combobox
            datas={districts}
            labelKey="name"
            valueKey="id"
            defaultValue={data.district_id ?? ""}
            onSelect={(value) => selectDistrict(value)}
            placeholder="Pilih Kecamatan..."
            notFoundText="Kecamatan tidak ditemukan."
            className="mt-1 w-full"
          />

          <InputError className="mt-2" message={errors.district_id} />
        </div>

        <div className="flex items-center gap-4 justify-end">
          <SecondaryButton onClick={cancel}>Batal</SecondaryButton>

          <PrimaryButton disabled={processing}>Simpan</PrimaryButton>

          <Transition
            show={recentlySuccessful}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0">
            <p className="text-sm text-gray-600">Saved.</p>
          </Transition>
        </div>
      </form>
    </section>
  );
}
