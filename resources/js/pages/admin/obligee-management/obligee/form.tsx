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

interface Props {
  obligee?: any;
  routeSubmit: string;
  routeBack: string;
}

const Form: React.FC<Props> = ({ obligee, routeSubmit, routeBack }) => {
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm<{
    id: number | null;
    name: string;
    telephone: string;
    address: string;
    province_id: number | null;
    regency_id: number | null;
    district_id: number | null;
    village: string;
    postal_code: string;
    fax: string;
    pic: string;
    picture: string;
  }>({
    id: obligee?.id ?? null,
    name: obligee?.name ?? "",
    telephone: obligee?.telephone ?? "",
    address: obligee?.address ?? "",
    province_id: obligee?.province_id ?? null,
    regency_id: obligee?.regency_id ?? null,
    district_id: obligee?.district_id ?? null,
    village: obligee?.village ?? "",
    postal_code: obligee?.postal_code ?? "",
    fax: obligee?.fax ?? "",
    pic: obligee?.pic ?? "",
    picture: obligee?.picture ?? "",
  });

  const cancel = () => {
    router.get(routeBack);
  };

  const submit: FormEventHandler<HTMLFormElement> = (event: any) => {
    event.preventDefault();

    if (data.id) {
      router.post(
        routeSubmit,
        { ...data, _method: "put" },
        {
          preserveScroll: true,
          preserveState: true,
          onFinish: () => {
            router.get(routeBack);
          },
        },
      );
    } else {
      post(routeSubmit, {
        preserveScroll: true,
        preserveState: true,
        onFinish: () => {
          router.get(routeBack);
        },
      });
    }
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-6">
      <div>
        <InputLabel htmlFor="pic" value="Penanggung Jawab (PIC)" />
        <TextInput
          id="pic"
          className="mt-1 block w-full"
          placeholder="Masukkan PenanggungJawab PIC..."
          value={data.pic || ""}
          onChange={(e) => setData("pic", e.target.value)}
          required
          autoComplete="pic"
        />
        <InputError className="mt-2" message={errors.pic} />
      </div>
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

      {/* 3. Province */}
      {/* 4. Regency */}
      {/* 5. District */}
      {/* 6. Village */}
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

      {/* 7. Alamat */}
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

      {/* 8. Kode Pos */}
      <div>
        <InputLabel htmlFor="postal_code" value="Kode Pos" />
        <TextInput
          id="postal_code"
          type="number"
          className="mt-1 block w-full"
          placeholder="Masukkan Kode Pos..."
          value={data.postal_code || ""}
          onChange={(e) => setData("postal_code", e.target.value)}
          required
          autoComplete="postal_code"
          min="0"
        />
        <InputError className="mt-2" message={errors.postal_code} />
      </div>

      {/* 9. Fax */}
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
