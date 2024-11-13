import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import InputLocation from "@/components/common/input-location";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import TextInput from "@/components/common/text-input";
import { Textarea } from "@/components/ui/textarea";
import { Transition } from "@headlessui/react";
import { router, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function UpdateProfileBprInformation({
  profile,
  className = "",
}: {
  profile?: any;
  className?: string;
}) {
  const { data, setData, patch, errors, processing, recentlySuccessful } = useForm<{
    id?: number;
    code?: string;
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    province_id: number | null;
    regency_id: number | null;
    district_id: number | null;
    village: string;
    postal_code?: string;
  }>({
    id: profile?.id,
    code: profile?.code,
    name: profile?.name,
    email: profile?.email,
    phone: profile?.phone,
    address: profile?.address,
    province_id: profile?.province_id ?? null,
    regency_id: profile?.regency_id ?? null,
    district_id: profile?.district_id ?? null,
    village: profile?.village ?? "",
    postal_code: profile?.postal_code,
  });

  const cancel = () => {
    router.get(route("profile.edit"));
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    patch(route("profile.update.bpr"), {
      preserveScroll: true,
      onSuccess: () => {
        router.get(route("profile.edit"));
      },
    });
  };

  return (
    <section className={className}>
      <header>
        <h2 className="text-lg font-medium text-gray-900">Informasi Pusat</h2>

        <p className="mt-1 text-sm text-gray-600">Untuk memperbarui informasi perusahaan BPR pusat</p>
      </header>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <InputLabel htmlFor="code" value="Kode" />

          <TextInput
            id="code"
            className="mt-1 block w-full"
            value={data.code}
            onChange={(e) => setData("code", e.target.value)}
            required
            autoComplete="code"
          />

          <InputError className="mt-2" message={errors.code} />
        </div>
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
            autoComplete="phone"
          />

          <InputError className="mt-2" message={errors.phone} />
        </div>

        <InputLocation
          province_id={data.province_id}
          regency_id={data.regency_id}
          district_id={data.district_id}
          village={data.village}
          setProvinceId={(id) =>
            setData((prev) => ({
              ...prev,
              province_id: id,
              regency_id: null,
              district_id: null,
              village: "",
            }))
          }
          setRegencyId={(id) =>
            setData((prev) => ({
              ...prev,
              regency_id: id,
              district_id: null,
              village: "",
            }))
          }
          setDistrictId={(id) => setData((prev) => ({ ...prev, district_id: id, village: "" }))}
          setVillage={(value) => setData("village", value)}
          error_province_id={errors.province_id}
          error_regency_id={errors.regency_id}
          error_district_id={errors.district_id}
        />

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
          <InputLabel htmlFor="postal_code" value="Kode Pos" />

          <TextInput
            id="postal_code"
            className="mt-1 block w-full"
            value={data.postal_code}
            onChange={(e) => setData("postal_code", e.target.value)}
            required
            autoComplete="postal_code"
          />

          <InputError className="mt-2" message={errors.postal_code} />
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
