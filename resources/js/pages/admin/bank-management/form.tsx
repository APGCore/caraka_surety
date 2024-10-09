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

const BankForm: React.FC<Props> = ({ obligee, routeSubmit, routeBack }) => {
  const { data, setData, post, patch, errors, processing, recentlySuccessful } = useForm<{
    id: number | null;
    name: string;
    telephone: string;
    address: string;
    province_id: number | null;
    regency_id: number | null;
    district_id: number | null;
    village: string;
    fax: string;
    pic: string;
    description: string;
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
    fax: obligee?.fax ?? "",
    pic: obligee?.pic ?? "",
    description: obligee?.description ?? "",
    picture: obligee?.picture ?? "",
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

      <InputLocation
        province_id={data.province_id}
        regency_id={data.regency_id}
        district_id={data.district_id}
        village={data.village}
        setProvinceId={(value) => setData("province_id", value)}
        setRegencyId={(value) => setData("regency_id", value)}
        setDistrictId={(value) => setData("district_id", value)}
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
        <InputLabel htmlFor="fax" value="Fax" />

        <TextInput
          id="fax"
          className="mt-1 block w-full"
          value={data.fax}
          onChange={(e) => setData("fax", e.target.value)}
          autoComplete="fax"
        />

        <InputError className="mt-2" message={errors.fax} />
      </div>

      <div>
        <InputLabel htmlFor="pic" value="PIC" />

        <TextInput
          id="pic"
          className="mt-1 block w-full"
          value={data.pic}
          onChange={(e) => setData("pic", e.target.value)}
          required
          autoComplete="pic"
        />

        <InputError className="mt-2" message={errors.pic} />
      </div>

      <div>
        <InputLabel htmlFor="picture" value="Picture" />

        <TextInput
          id="picture"
          className="mt-1 block w-full"
          value={data.picture}
          onChange={(e) => setData("picture", e.target.value)}
          required
          autoComplete="picture"
        />

        <InputError className="mt-2" message={errors.picture} />
      </div>

      <div>
        <InputLabel htmlFor="description" value="Deskripsi" />

        <Textarea
          id="description"
          className="mt-1 block w-full"
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
          required
          autoComplete="description"
        />

        <InputError className="mt-2" message={errors.description} />
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

export default BankForm;
