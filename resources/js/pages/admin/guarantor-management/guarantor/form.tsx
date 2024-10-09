import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import TextInput from "@/components/common/text-input";
import { Textarea } from "@/components/ui/textarea";
import { Transition } from "@headlessui/react";
import { router, useForm } from "@inertiajs/react";
import { Dispatch, FormEventHandler, SetStateAction } from "react";

interface Props {
  guarantor?: any;
  provinces: any;
  selectProvince: Dispatch<SetStateAction<number | null>>;
  selectedProvince: number | null;
  regencies: any;
  selectRegency: Dispatch<SetStateAction<number | null>>;
  selectedRegency: number | null;
  districts: any;
  selectDistrict: Dispatch<SetStateAction<number | null>>;
  selectedDistrict: number | null;
  routeSubmit: string;
  routeBack: string;
}

const Form: React.FC<Props> = ({
  guarantor,
  provinces,
  selectProvince,
  selectedProvince,
  regencies,
  selectRegency,
  selectedRegency,
  districts,
  selectDistrict,
  selectedDistrict,
  routeSubmit,
  routeBack,
}) => {
  const { data, setData, post, patch, errors, processing, recentlySuccessful } = useForm<{
    id: number | null;
    name: string;
    email: string;
    telephone: string;
    address: string;
    province_id: number;
    regency_id: number;
    district_id: number;
    village: string;
    fax: string;
    pic: string;
  }>({
    id: guarantor?.id ?? null,
    name: guarantor?.name ?? "",
    email: guarantor?.email ?? "",
    telephone: guarantor?.telephone ?? "",
    address: guarantor?.address ?? "",
    province_id: guarantor?.province_id ?? null,
    regency_id: guarantor?.regency_id ?? null,
    district_id: guarantor?.district_id ?? null,
    village: guarantor?.village ?? "",
    fax: guarantor?.fax ?? "",
    pic: guarantor?.pic ?? "",
  });

  const cancel = () => {
    router.get(routeBack);
  };

  const submit: FormEventHandler<HTMLFormElement> = (event: any) => {
    event.preventDefault();

    if (data.id) {
      patch(routeSubmit, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          router.get(routeBack);
        },
      });
    } else {
      post(routeSubmit, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          router.get(routeBack);
        },
      });
    }
  };

  return (
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
          autoComplete="email"
        />

        <InputError className="mt-2" message={errors.email} />
      </div>
      <div>
        <InputLabel htmlFor="telephone" value="Telepon" />

        <TextInput
          id="telephone"
          className="mt-1 block w-full"
          value={data.telephone}
          onChange={(e) => setData("telephone", e.target.value)}
          required
          autoComplete="telephone"
        />

        <InputError className="mt-2" message={errors.telephone} />
      </div>
      <div>
        <InputLabel htmlFor="province_id" value="Provinsi" />

        <Combobox
          datas={provinces}
          labelKey="name"
          valueKey="id"
          defaultValue={selectedProvince ? selectedProvince : (data.province_id ?? "")}
          onSelect={(value) => selectProvince(value.id)}
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
          defaultValue={selectedRegency ? selectedRegency : (data.regency_id ?? "")}
          onSelect={(value) => selectRegency(value.id)}
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
          defaultValue={selectedDistrict ? selectedDistrict : (data.district_id ?? "")}
          onSelect={(value) => selectDistrict(value.id)}
          placeholder="Pilih Kecamatan..."
          notFoundText="Kecamatan tidak ditemukan."
          className="mt-1 w-full"
        />

        <InputError className="mt-2" message={errors.district_id} />
      </div>

      <div>
        <InputLabel htmlFor="village" value="Desa/Kelurahan" />

        <TextInput
          id="village"
          className="mt-1 block w-full"
          value={data.village}
          onChange={(e) => setData("village", e.target.value)}
          required
          autoComplete="village"
        />
        <InputError className="mt-2" message={errors.village} />
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
        <InputLabel htmlFor="fax" value="Kode Pos" />

        <TextInput
          id="fax"
          className="mt-1 block w-full"
          value={data.fax}
          onChange={(e) => setData("fax", e.target.value)}
          autoComplete="fax"
        />

        <InputError className="mt-2" message={errors.fax} />
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
  );
};

export default Form;
