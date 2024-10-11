import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import TextInput from "@/components/common/text-input";
import { Textarea } from "@/components/ui/textarea";
import { Transition } from "@headlessui/react";
import { FormEventHandler } from "react";

interface Props {
  submitForm: FormEventHandler<HTMLFormElement>;
  data: any;
  provinces: any;
  selectProvince: (value: number) => void;
  regencies: any;
  selectRegency: (value: number) => void;
  districts: any;
  selectDistrict: (value: number) => void;
  setData: any;
  errors: any;
  processing: any;
  recentlySuccessful: any;
  cancel: () => void;
}

const Form: React.FC<Props> = ({
  submitForm,
  data,
  setData,
  provinces,
  selectProvince,
  regencies,
  selectRegency,
  districts,
  selectDistrict,
  errors,
  processing,
  recentlySuccessful,
  cancel,
}) => {
  return (
    <form onSubmit={submitForm} className="mt-6 space-y-6">
      {/* 1. Nama */}
      <div>
        <InputLabel htmlFor="name" value="Nama" />
        <TextInput
          id="name"
          className="mt-1 block w-full"
          placeholder="Masukkan Nama..."
          value={data.name || ""}
          onChange={(e) => setData("name", e.target.value)}
          required
          isFocused
          autoComplete="name"
        />
        <InputError className="mt-2" message={errors.name} />
      </div>

      {/* 2. Telephone */}
      <div>
        <InputLabel htmlFor="telephone" value="Telepon" />
        <TextInput
          id="telephone"
          className="mt-1 block w-full"
          placeholder="Masukkan No Telp..."
          type="number"
          value={data.telephone || ""}
          onChange={(e) => setData("telephone", e.target.value)}
          required
          autoComplete="telephone"
        />
        <InputError className="mt-2" message={errors.telephone} />
      </div>

      {/* 3. Alamat */}
      <div>
        <InputLabel htmlFor="address" value="Alamat" />
        <Textarea
          id="address"
          className="mt-1 block w-full"
          placeholder="Masukkan Alamat..."
          value={data.address || ""}
          onChange={(e) => setData("address", e.target.value)}
          required
          autoComplete="address"
        />
        <InputError className="mt-2" message={errors.address} />
      </div>

      {/* 4. Provinsi */}
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

      {/* 5. Kabupaten/Kota */}
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

      {/* 6. Kecamatan */}
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

      {/* 7. Desa/Kelurahan */}
      <div>
        <InputLabel htmlFor="village" value="Desa/Kelurahan" />
        <TextInput
          id="village"
          placeholder="Masukkan Desa..."
          className="mt-1 block w-full"
          value={data.village}
          onChange={(e) => setData("village", e.target.value)}
          required
          autoComplete="village"
        />
        <InputError className="mt-2" message={errors.village} />
      </div>

      {/* 8. Fax */}
      <div>
        <InputLabel htmlFor="fax" value="Fax" />
        <TextInput
          id="fax"
          type="number"
          className="mt-1 block w-full"
          placeholder="Masukkan No Fax..."
          value={data.fax || ""}
          onChange={(e) => setData("fax", e.target.value)}
          required
          autoComplete="fax"
        />
        <InputError className="mt-2" message={errors.fax} />
      </div>

      {/* 9. PIC */}
      <div>
        <InputLabel htmlFor="pic" value="PIC" />
        <TextInput
          id="pic"
          className="mt-1 block w-full"
          placeholder="Masukkan PIC..."
          value={data.pic || ""}
          onChange={(e) => setData("pic", e.target.value)}
          required
          autoComplete="pic"
        />
        <InputError className="mt-2" message={errors.pic} />
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
