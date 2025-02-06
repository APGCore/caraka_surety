import { Avatar, AvatarFallback, AvatarImage } from "@/components/_shadcn-ui/avatar";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import PrimaryButton from "@/components/atoms/button/primary-button";
import SecondaryButton from "@/components/atoms/button/secondary-button";
import InputError from "@/components/molecules/input/error-input";
import InputLabel from "@/components/molecules/input/label-input";
import InputLocation from "@/components/molecules/input/location-input";
import TextInput from "@/components/molecules/input/text-input";
import { router, useForm } from "@inertiajs/react";
import { FormEvent, FormEventHandler, useRef, useState } from "react";

interface Props {
  guarantor: any;
  branchGuarantor?: any;
  routeSubmit: string;
  routeBack: string;
}

const BranchGuarantorForm: React.FC<Props> = ({ guarantor, branchGuarantor, routeSubmit, routeBack }) => {
  const { data, setData, post, errors, processing } = useForm<{
    headquarter_id: number | null;
    id: number | null;
    code: string;
    name: string;
    email: string;
    telephone: string;
    address: string;
    province_id: number | null;
    regency_id: number | null;
    district_id: number | null;
    village: string;
    postal_code: string;
    fax: string;
    pic: string;
    picture: string | null;
    upload_picture: File | null;
    prefix: string;
    content: string;
    suffix: string;
  }>({
    headquarter_id: guarantor.id,
    id: branchGuarantor?.id ?? null,
    code: branchGuarantor?.code ?? "",
    name: branchGuarantor?.name ?? "",
    email: branchGuarantor?.email ?? "",
    telephone: branchGuarantor?.telephone ?? "",
    address: branchGuarantor?.address ?? "",
    province_id: branchGuarantor?.province_id ?? null,
    regency_id: branchGuarantor?.regency_id ?? null,
    district_id: branchGuarantor?.district_id ?? null,
    village: branchGuarantor?.village ?? "",
    postal_code: branchGuarantor?.postal_code ?? "",
    fax: branchGuarantor?.fax ?? "",
    pic: branchGuarantor?.pic ?? "",
    picture: branchGuarantor?.picture ?? null,
    upload_picture: null,
    prefix: branchGuarantor?.pattern?.prefix ?? "",
    content: branchGuarantor?.pattern?.content ?? "",
    suffix: branchGuarantor?.pattern?.suffix ?? "",
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const cancel = () => {
    router.get(routeBack);
  };

  const submit: FormEventHandler<HTMLFormElement> = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    post(routeSubmit, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        router.get(routeBack);
      },
      onError: (value: any) => {
        console.log(value);
      },
    });
  };

  return (
    <form onSubmit={submit} className="mt-6 space-y-6">
      <div className="flex items-center justify-center">
        <Avatar
          className="w-[200px] h-[200px] shadow-2xl"
          onClick={() => {
            inputRef.current?.click();
          }}>
          <AvatarImage
            src={
              (preview ?? (data.picture && data.picture !== "" ? data.picture : undefined)) ||
              "https://github.com/shadcn.png"
            }
            alt="@shadcn"
            className="object-contain w-full h-full"
          />
          <AvatarFallback>Foto</AvatarFallback>
        </Avatar>
        <input
          id="picture"
          type="file"
          hidden
          ref={inputRef}
          alt="png,jpg"
          onChange={(e) => {
            const file = e?.target?.files ? e.target.files[0] : null;

            if (!file) {
              setData("upload_picture", null);
              return;
            }

            setData("upload_picture", file);
            setPreview(URL.createObjectURL(file));
          }}
        />
      </div>
      <div className="space-y-2">
        <InputLabel htmlFor="pic" value="Penanggung Jawab(PIC)" />

        <TextInput
          id="pic"
          className="mt-1 block w-full"
          value={data.pic}
          onChange={(e) => setData("pic", e.target.value)}
          isFocused
          autoComplete="pic"
        />

        <InputError className="mt-2" message={errors.pic} />
      </div>
      <div className="space-y-2">
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
      <div className="space-y-2">
        <InputLabel htmlFor="name" value="Nama" />

        <TextInput
          id="name"
          className="mt-1 block w-full"
          value={data.name}
          onChange={(e) => setData("name", e.target.value)}
          required
          autoComplete="name"
        />

        <InputError className="mt-2" message={errors.name} />
      </div>
      <div className="space-y-2">
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
      <div className="space-y-2">
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
      <div className="space-y-2">
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
      <div className="space-y-2">
        <InputLabel htmlFor="postal_code" value="Kode Pos" />
        <TextInput
          id="postal_code"
          className="mt-1 block w-full"
          value={data.postal_code}
          onChange={(e) => setData("postal_code", e.target.value)}
          autoComplete="postal_code"
          min="0"
          required
        />
        <InputError className="mt-2" message={errors.postal_code} />
      </div>
      <div className="space-y-2">
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

      <div className="flex items-center gap-4 justify-end">
        <SecondaryButton onClick={cancel}>Batal</SecondaryButton>

        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
      </div>
    </form>
  );
};

export default BranchGuarantorForm;
