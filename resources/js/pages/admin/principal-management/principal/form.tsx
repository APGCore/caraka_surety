import { Textarea } from "@/components/_shadcn-ui/textarea";
import PrimaryButton from "@/components/atoms/button/primary-button";
import SecondaryButton from "@/components/atoms/button/secondary-button";
import { Combobox } from "@/components/molecules/combobox";
import InputError from "@/components/molecules/input/error-input";
import InputLabel from "@/components/molecules/input/label-input";
import TextInput from "@/components/molecules/input/text-input";
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
                />
                <InputError className="mt-2" message={errors.telephone} />
            </div>

            {/* 3. Fax */}
            <div>
                <InputLabel htmlFor="fax" value="Fax" />
                <TextInput
                    id="fax"
                    className="mt-1 block w-full"
                    placeholder="Masukkan No Fax..."
                    type="number"
                    value={data.fax || ""}
                    onChange={(e) => setData("fax", e.target.value)}
                />
                <InputError className="mt-2" message={errors.fax} />
            </div>

            {/* 4. Alamat */}
            <div>
                <InputLabel htmlFor="address" value="Alamat" />
                <Textarea
                    id="address"
                    className="mt-1 block w-full"
                    placeholder="Masukkan Alamat..."
                    value={data.address || ""}
                    onChange={(e) => setData("address", e.target.value)}
                    required
                />
                <InputError className="mt-2" message={errors.address} />
            </div>

            {/* 5. Provinsi */}
            <div>
                <InputLabel htmlFor="province_id" value="Provinsi" />
                <Combobox
                    datas={provinces}
                    labelKey="name"
                    valueKey="id"
                    defaultValue={data.province_id ?? ""}
                    onSelect={(value) => selectProvince(value)}
                    placeholder="Pilih Provinsi..."
                    className="mt-1 w-full"
                />
                <InputError className="mt-2" message={errors.province_id} />
            </div>

            {/* 6. Kabupaten/Kota */}
            <div>
                <InputLabel htmlFor="regency_id" value="Kabupaten/Kota" />
                <Combobox
                    datas={regencies}
                    labelKey="name"
                    valueKey="id"
                    defaultValue={data.regency_id ?? ""}
                    onSelect={(value) => selectRegency(value)}
                    placeholder="Pilih Kabupaten/Kota..."
                    className="mt-1 w-full"
                />
                <InputError className="mt-2" message={errors.regency_id} />
            </div>

            {/* 7. Kecamatan */}
            <div>
                <InputLabel htmlFor="district_id" value="Kecamatan" />
                <Combobox
                    datas={districts}
                    labelKey="name"
                    valueKey="id"
                    defaultValue={data.district_id ?? ""}
                    onSelect={(value) => selectDistrict(value)}
                    placeholder="Pilih Kecamatan..."
                    className="mt-1 w-full"
                />
                <InputError className="mt-2" message={errors.district_id} />
            </div>

            {/* 8. Desa/Kelurahan */}
            <div>
                <InputLabel htmlFor="village" value="Desa/Kelurahan" />
                <TextInput
                    id="village"
                    placeholder="Masukkan Desa..."
                    className="mt-1 block w-full"
                    value={data.village}
                    onChange={(e) => setData("village", e.target.value)}
                    required
                />
                <InputError className="mt-2" message={errors.village} />
            </div>

            {/* 9. NPWP */}
            <div>
                <InputLabel htmlFor="npwp" value="NPWP" />
                <TextInput
                    id="npwp"
                    type="number"
                    className="mt-1 block w-full"
                    placeholder="Masukkan NPWP..."
                    value={data.npwp || ""}
                    onChange={(e) => setData("npwp", e.target.value)}
                />
                <InputError className="mt-2" message={errors.npwp} />
            </div>

            {/* 10. NIB */}
            <div>
                <InputLabel htmlFor="nib" value="NIB" />
                <TextInput
                    id="nib"
                    type="number"
                    className="mt-1 block w-full"
                    placeholder="Masukkan NIB..."
                    value={data.nib || ""}
                    onChange={(e) => setData("nib", e.target.value)}
                />
                <InputError className="mt-2" message={errors.nib} />
            </div>

            {/* 11. SIUP/SIUJK */}
            <div>
                <InputLabel htmlFor="siup_siujk" value="SIUP/SIUJK" />
                <TextInput
                    id="siup_siujk"
                    className="mt-1 block w-full"
                    placeholder="Masukkan SIUP/SIUJK..."
                    value={data.siup_siujk || ""}
                    onChange={(e) => setData("siup_siujk", e.target.value)}
                />
                <InputError className="mt-2" message={errors.siup_siujk} />
            </div>

            {/* 12. Nama Pimpinan */}
            <div>
                <InputLabel htmlFor="head_name" value="Nama Pimpinan" />
                <TextInput
                    id="head_name"
                    className="mt-1 block w-full"
                    placeholder="Masukkan Nama Pimpinan..."
                    value={data.head_name || ""}
                    onChange={(e) => setData("head_name", e.target.value)}
                />
                <InputError className="mt-2" message={errors.head_name} />
            </div>

            {/* 13. Nama Direktur */}
            <div>
                <InputLabel htmlFor="director_name" value="Nama Direktur" />
                <TextInput
                    id="director_name"
                    className="mt-1 block w-full"
                    placeholder="Masukkan Nama Direktur..."
                    value={data.director_name || ""}
                    onChange={(e) => setData("director_name", e.target.value)}
                    required
                />
                <InputError className="mt-2" message={errors.director_name} />
            </div>

            {/* 14. Jabatan Direktur */}
            <div>
                <InputLabel htmlFor="director_position" value="Jabatan Direktur" />
                <TextInput
                    id="director_position"
                    className="mt-1 block w-full"
                    placeholder="Masukkan Jabatan Direktur..."
                    value={data.director_position || ""}
                    onChange={(e) => setData("director_position", e.target.value)}
                />
                <InputError className="mt-2" message={errors.director_position} />
            </div>

            {/* 15. Telepon Direktur */}
            <div>
                <InputLabel htmlFor="director_phone" value="Telepon Direktur" />
                <TextInput
                    id="director_phone"
                    className="mt-1 block w-full"
                    placeholder="Masukkan Telepon Direktur..."
                    value={data.director_phone || ""}
                    onChange={(e) => setData("director_phone", e.target.value)}
                />
                <InputError className="mt-2" message={errors.director_phone} />
            </div>

            {/* 16. Komisaris */}
            <div>
                <InputLabel htmlFor="commissioner" value="Komisaris" />
                <TextInput
                    id="commissioner"
                    className="mt-1 block w-full"
                    placeholder="Masukkan Komisaris..."
                    value={data.commissioner || ""}
                    onChange={(e) => setData("commissioner", e.target.value)}
                />
                <InputError className="mt-2" message={errors.commissioner} />
            </div>

            {/* 17. Tahun Berdiri */}
            <div>
                <InputLabel htmlFor="year_established" value="Tahun Berdiri" />
                <TextInput
                    id="year_established"
                    className="mt-1 block w-full"
                    placeholder="Masukkan Tahun Berdiri..."
                    type="number"
                    value={data.year_established || ""}
                    onChange={(e) => setData("year_established", e.target.value)}
                />
                <InputError className="mt-2" message={errors.year_established} />
            </div>

            {/* 18. Akta Pendirian */}
            <div>
                <InputLabel htmlFor="est_deed" value="Akta Pendirian" />
                <TextInput
                    id="est_deed"
                    className="mt-1 block w-full"
                    placeholder="Masukkan Akta Pendirian..."
                    value={data.est_deed || ""}
                    onChange={(e) => setData("est_deed", e.target.value)}
                />
                <InputError className="mt-2" message={errors.est_deed} />
            </div>

            {/* 19.Akta Terakhir   */}
            <div>
                <InputLabel htmlFor="last_deed" value="Akta Terakhir" />
                <TextInput
                    id="last_deed"
                    className="mt-1 block w-full"
                    placeholder="Masukkan Akta Terakhir..."
                    value={data.last_deed || ""}
                    onChange={(e) => setData("last_deed", e.target.value)}
                />
                <InputError className="mt-2" message={errors.last_deed} />
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
