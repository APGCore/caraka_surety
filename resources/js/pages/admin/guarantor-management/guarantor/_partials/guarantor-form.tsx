import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import InputLocation from "@/components/common/input-location";
import PrimaryButton from "@/components/common/primary-button";
import SecondaryButton from "@/components/common/secondary-button";
import TextInput from "@/components/common/text-input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { router, useForm } from "@inertiajs/react";
import axios from "axios";
import { FormEvent, FormEventHandler, useEffect, useRef, useState } from "react";

interface Props {
  guarantor?: any;
  routeSubmit: string;
  routeBack: string;
}

const GuarantorForm: React.FC<Props> = ({ guarantor, routeSubmit, routeBack }) => {
  const { data, setData, post, errors, processing } = useForm<{
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
    id: guarantor?.id ?? null,
    code: guarantor?.code ?? "",
    name: guarantor?.name ?? "",
    email: guarantor?.email ?? "",
    telephone: guarantor?.telephone ?? "",
    address: guarantor?.address ?? "",
    province_id: guarantor?.province_id ?? null,
    regency_id: guarantor?.regency_id ?? null,
    district_id: guarantor?.district_id ?? null,
    village: guarantor?.village ?? "",
    postal_code: guarantor?.postal_code ?? "",
    fax: guarantor?.fax ?? "",
    pic: guarantor?.pic ?? "",
    picture: guarantor?.picture ?? null,
    upload_picture: null,
    prefix: guarantor?.pattern?.prefix ?? "",
    content: guarantor?.pattern?.content ?? "",
    suffix: guarantor?.pattern?.suffix ?? "",
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [contentConverted, setContentConverted] = useState<string | null>(null);
  const [previewPattern, setPreviewPattern] = useState<string | null>(null);

  const changePrefix = (value: string) => {
    setData("prefix", value);
    setPreviewPattern(value + contentConverted + data.suffix);
  };

  const addContent = (value: string) => {
    const content = data.content + value;
    setData("content", content);
    convertPattern(content);
  };

  const changeContent = (value: string) => {
    setData("content", value);
    convertPattern(value);
  };

  const changeSuffix = (value: string) => {
    setData("suffix", value);
    setPreviewPattern(data.prefix + contentConverted + value);
  };

  const convertPattern = (value: string) => {
    if (value === "") {
      setPreviewPattern("");
      return;
    }
    axios
      .get(route("references.pattern.convert"), {
        params: {
          content: value,
        },
      })
      .then((r) => {
        const responseData = r.data;
        setContentConverted(responseData.data);
        setPreviewPattern(data.prefix + responseData.data + data.suffix);
      });
  };

  const setSequence = (code: string, length: number) => {
    const result = "{" + code.replace(/[{}]/g, "") + ":" + length + "}";
    setData("content", data.content + result);
    convertPattern(data.content + result);
  };
  const clear = () => {
    setData({ ...data, prefix: "", content: "", suffix: "" });
    setContentConverted("");
    setPreviewPattern("");
  };

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

  useEffect(() => {
    if (data.content && !contentConverted) {
      convertPattern(data.prefix + data.content + data.suffix);
    }
  }, []);

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

      <Card className="mx-auto">
        <CardHeader>
          <CardTitle>Format Penomoran Surat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex">
            <div className="w-[500px] mr-6 space-y-2">
              <Label>Preview: </Label>
              <p>{previewPattern}</p>
              <Button type="button" className="w-full" variant="outline" onClick={clear}>
                Clear
              </Button>
            </div>
            <div className="space-y-4 w-full">
              <div className="space-y-2 w-full">
                <InputLabel htmlFor="perfix" value="Awalan" />
                <TextInput
                  id="prefix"
                  className="mt-1 block w-full"
                  value={data.prefix}
                  onChange={(e) => changePrefix(e.target.value)}
                  autoComplete="prefix"
                />
                <InputError className="mt-2" message={errors.prefix} />
              </div>
              <div className="space-y-2 w-full">
                <InputLabel htmlFor="content" value="Isian" />
                <TextInput
                  id="content"
                  className="mt-1 block w-full"
                  value={data.content}
                  onChange={(e) => changeContent(e.target.value)}
                  autoComplete="content"
                />
                <InputError className="mt-2" message={errors.content} />
              </div>
              <div className="space-y-2 w-full">
                <InputLabel htmlFor="suffix" value="Akhiran" />
                <TextInput
                  id="suffix"
                  className="mt-1 block w-full"
                  value={data.suffix}
                  onChange={(e) => changeSuffix(e.target.value)}
                  autoComplete="suffix"
                />
                <InputError className="mt-2" message={errors.suffix} />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label />
            Pilih asal kode
            <Label />
            <div className="grid grid-cols-2 gap-2">
              <Button type="button" className="w-full" variant="outline" onClick={() => addContent("{KA}")}>
                Kode Cabang/Kantor Asuransi (KA)
              </Button>
              <Button type="button" className="w-full" variant="outline" onClick={() => addContent("{KP}")}>
                Kode Produk (KP)
              </Button>
              <Button type="button" className="w-full" variant="outline" onClick={() => addContent("{KB}")}>
                Kode Blangko (KB)
              </Button>
              <PopoverCustom
                title={"No Terakhir Kode Blangko (NOKB)"}
                code={"{NOKB}"}
                onSave={(code, length) => setSequence(code, length)}
              />
              <Button type="button" className="w-full" variant="outline" onClick={() => addContent("{d}")}>
                Hari (d)
              </Button>
              <Button type="button" className="w-full" variant="outline" onClick={() => addContent("{m}")}>
                Bulan (m)
              </Button>
              <Button type="button" className="w-full" variant="outline" onClick={() => addContent("{y}")}>
                Tahun (y)
              </Button>
              <Button type="button" className="w-full" variant="outline" onClick={() => addContent("{Y}")}>
                Tahun (Y)
              </Button>
              {/* no urut */}
              <Button type="button" className="w-full" variant="outline" onClick={() => addContent("{NOA}")}>
                Nomor Urut Agent (NOA)
              </Button>
              <PopoverCustom
                title={"No Urut Setiap Hari (NOD)"}
                code={"{NOD}"}
                onSave={(code, length) => setSequence(code, length)}
              />
              <PopoverCustom
                title={"No Urut Setiap Bulan (NOM)"}
                code={"{NOM}"}
                onSave={(code, length) => setSequence(code, length)}
              />
              <PopoverCustom
                title={"No Urut Setiap Tahun (NOY)"}
                code={"{NOY}"}
                onSave={(code, length) => setSequence(code, length)}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center gap-4 justify-end">
        <SecondaryButton onClick={cancel}>Batal</SecondaryButton>

        <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
      </div>
    </form>
  );
};

const PopoverCustom = ({
  title,
  code,
  onSave,
}: {
  title: string;
  code: string;
  onSave: (code: string, length: number) => void;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [length, setLength] = useState<number>(0);

  const setSequence = () => {
    onSave(code, length);
    setOpen(false);
  };

  return (
    <Popover open={open}>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={() => setOpen(!open)}>
          {title}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Panjang Nomor</h4>
            <p className="text-sm text-muted-foreground">Jika anda menuliskan 5 maka akan dibuat (00001)</p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="width">Panjang</Label>
              <Input
                id="width"
                type="number"
                defaultValue="0"
                min="0"
                className="col-span-2 h-8"
                onChange={(e) => setLength(Number(e.target.value))}
              />
            </div>
            {/*simpan*/}
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Batal
              </Button>
              <Button onClick={() => setSequence()}>Simpan</Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GuarantorForm;
