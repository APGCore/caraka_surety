import { Avatar, AvatarFallback, AvatarImage } from "@/components/_shadcn-ui/avatar";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import PrimaryButton from "@/components/atoms/button/primary-button";
import SecondaryButton from "@/components/atoms/button/secondary-button";
import InputError from "@/components/molecules/input/error-input";
import InputLabel from "@/components/molecules/input/label-input";
import InputLocation from "@/components/molecules/input/location-input";
import TextInput from "@/components/molecules/input/text-input";
import { Transition } from "@headlessui/react";
import { router, useForm } from "@inertiajs/react";
import { FormEventHandler, useRef, useState } from "react";

interface Props {
  bank?: any;
  routeSubmit: string;
  routeBack: string;
}

const Form: React.FC<Props> = ({ bank, routeSubmit, routeBack }) => {
  const { data, setData, post, errors, processing, recentlySuccessful } = useForm<{
    id: number;
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
    upload_picture: File | null;
  }>({
    id: bank?.id,
    name: bank?.name,
    telephone: bank?.telephone,
    address: bank?.address,
    province_id: bank?.province_id,
    regency_id: bank?.regency_id,
    district_id: bank?.district_id,
    village: bank?.village,
    postal_code: bank?.postal_code,
    fax: bank?.fax,
    pic: bank?.pic,
    picture: bank?.picture,
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
          placeholder="Masukkan nama bank..."
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
          type="number"
          className="mt-1 block w-full"
          placeholder="Masukkan nomor telepon..."
          value={data.telephone || ""}
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
          placeholder="Masukkan alamat bank..."
          className="mt-1 block w-full"
          value={data.address || ""}
          onChange={(e) => setData("address", e.target.value)}
          required
          autoComplete="address"
        />
        <InputError className="mt-2" message={errors.address} />
      </div>

      {/* 8. Kode Post */}
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
          placeholder="Masukkan Fax"
          className="mt-1 block w-full"
          value={data.fax || ""}
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
