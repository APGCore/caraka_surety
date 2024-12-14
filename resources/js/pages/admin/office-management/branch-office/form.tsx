import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import InputLocation from "@/components/common/input-location";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import TextInput from "@/components/common/text-input";
import { Textarea } from "@/components/ui/textarea";
import { router, useForm } from "@inertiajs/react";
import React, { FormEventHandler } from "react";

interface Props {
  branchOffice?: any;
  routeSubmit: string;
  routeBack: string;
}

const Form: React.FC<Props> = ({ branchOffice, routeSubmit, routeBack }) => {
  const { data, setData, post, patch, errors, processing } = useForm({
    id: branchOffice?.id ?? null,
    code: branchOffice?.code ?? "",
    name: branchOffice?.name ?? "",
    email: branchOffice?.email ?? "",
    phone: branchOffice?.phone ?? "",
    province_id: branchOffice?.province_id ?? null,
    regency_id: branchOffice?.regency_id ?? null,
    district_id: branchOffice?.district_id ?? null,
    village: branchOffice?.village ?? "",
    address: branchOffice?.address ?? "",
    postal_code: branchOffice?.postal_code ?? "",
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
        onFinish: () => {
          router.get(routeBack);
        },
      });
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
        <InputLabel htmlFor="code" value="Kode" />

        <TextInput
          id="code"
          className="mt-1 block w-full"
          value={data.code}
          onChange={(e) => setData("code", e.target.value)}
          required
          isFocused
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
        error_district_id={errors.district_id}
        error_regency_id={errors.regency_id}
        error_village={errors.village}
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
          min="0"
        />

        <InputError className="mt-2" message={errors.postal_code} />
      </div>
      <div className="flex items-center gap-4 justify-end">
        <SecondaryButton onClick={cancel}>Batal</SecondaryButton>

        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
      </div>
    </form>
  );
};

export default Form;
