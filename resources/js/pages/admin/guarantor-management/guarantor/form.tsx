import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import InputLocation from "@/components/common/input-location";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import TextInput from "@/components/common/text-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { router, useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";

interface Props {
  guarantor?: any;
  routeSubmit: string;
  routeBack: string;
}

const Form: React.FC<Props> = ({ guarantor, routeSubmit, routeBack }) => {
  const { data, setData, post, errors, processing } = useForm<{
    id: number | null;
    name: string;
    email: string;
    telephone: string;
    address: string;
    province_id: number | null;
    regency_id: number | null;
    district_id: number | null;
    village: string;
    fax: string;
    pic: string;
    picture: string | null;
    upload_picture: File | null;
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
    picture: guarantor?.picture ?? null,
    upload_picture: null,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

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
      <div className="flex items-center justify-center">
        <Avatar
          className="w-[200px] h-[200px] shadow-2xl"
          onClick={() => {
            inputRef.current?.click();
          }}>
          <AvatarImage
            src={preview ?? data.picture ?? "https://github.com/shadcn.png"}
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
      <div>
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

      <div>
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

export default Form;
