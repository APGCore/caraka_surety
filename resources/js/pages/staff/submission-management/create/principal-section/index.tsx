import {
    useGetAllProvince,
    useGetDistrictByRegencyId,
    useGetRegencyByProvinceId
} from "@/common/hooks/react-query/location";
import { getNumericValue } from "@/common/utils/get-numeric-value";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import { Combobox } from "@/components/molecules/combobox";
import React from "react";

interface PrincipalSectionProps {
  province_id?: string;
  regency_id?: string;
  district_id?: string;
  village: string;
  name: string;
  address: string;
  postal_code: string;
  telephone: number | string | undefined;
  fax: string;
  npwp: number | string | undefined;
  nib: number | string | undefined;
  siup_siujk: string;
  head_name: string;
  director_name: string;
  director_position: string;
  director_phone: number | string | undefined;
  commissioner: string;
  year_established?: number | string | undefined;
  est_deed: string;
  last_deed: string;
  business_fields: string;
  errors?: Record<string, string>;
  onChangePrincipal: (field: string, value: string | number) => void;
}

const PrincipalSection: React.FC<PrincipalSectionProps> = ({
  province_id,
  regency_id,
  district_id,
  name,
  telephone,
  npwp,
  nib,
  director_name,
  director_phone,
  director_position,
  commissioner,
  business_fields,
  year_established,
  est_deed,
  last_deed,
  village,
  address,
  postal_code,
  errors,
  onChangePrincipal,
}) => {
  const { data: provinces } = useGetAllProvince();
  const { data: regencies } = useGetRegencyByProvinceId(province_id?.toString());
  const { data: districts } = useGetDistrictByRegencyId(regency_id?.toString());

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let value;

    if (e.target instanceof HTMLTextAreaElement) {
      value = e.target.value;
    } else if (e.target instanceof HTMLInputElement) {
      value =
        e.target.type === "number" ? Number(getNumericValue(e as React.ChangeEvent<HTMLInputElement>)) : e.target.value;
    }

    onChangePrincipal(field, value || "");
  };

  const fields = [
    { key: "name", name: "Nama", value: name },
    { key: "telephone", name: "Nomor Telepon", value: telephone },
    { key: "npwp", name: "NPWP", value: npwp },
    { key: "nib", name: "NIB", value: nib },
    { key: "director_name", name: "Nama Direktur", value: director_name },
    { key: "director_phone", name: "Nomor Telepon Direktur", value: director_phone },
    { key: "director_position", name: "Posisi Direktur", value: director_position },
    { key: "commissioner", name: "Komisioner", value: commissioner },
    { key: "business_fields", name: "Bidang Usaha", value: business_fields },
    { key: "year_established", name: "Tahun Perusahaan Berdiri", value: year_established },
    { key: "est_deed", name: "Akte Pendirian", value: est_deed },
    { key: "last_deed", name: "Akte Perubahan Terakhir", value: last_deed },
  ];

  const biodatafields = [
    { key: "name", name: "Nama", value: name },
    {
      key: "business_info",
      name: "Informasi Bisnis",
      fields: [
        { key: "telephone", name: "Nomor Telepon", value: telephone },
        { key: "npwp", name: "NPWP", value: npwp },
        { key: "nib", name: "NIB", value: nib },
      ],
    },
    {
      key: "director_info",
      name: "Informasi Direktur",
      fields: [
        { key: "director_name", name: "Nama Direktur", value: director_name },
        { key: "director_phone", name: "Nomor Telepon Direktur", value: director_phone },
        { key: "director_position", name: "Posisi Direktur", value: director_position },
      ],
    },
    {
      key: "commissioner",
      name: "Komisioner",
      fields: [
        { key: "commissioner", name: "Nama Penanggung Jawab", value: commissioner },
        { key: "business_fields", name: "Bidang Usaha", value: business_fields },
      ],
    },
    {
      key: "deeds",
      name: "Dokumen Akta",
      fields: [
        { key: "year_established", name: "Tahun Perusahaan Berdiri", value: year_established },
        { key: "est_deed", name: "Akte Pendirian", value: est_deed },
        { key: "last_deed", name: "Akte Perubahan Terakhir", value: last_deed },
      ],
    },
  ];

  const locationFieldsCombobox = [
    { key: "province_id", name: "Provinsi", value: Number(province_id) },
    { key: "regency_id", name: "Kabupaten", value: Number(regency_id) },
    { key: "district_id", name: "Kecamatan", value: Number(district_id) },
  ];

  const locationFieldsInput = [
    { key: "village", name: "Desa", value: village },
    { key: "address", name: "Alamat", value: address },
    { key: "postal_code", name: "Kode Pos", value: postal_code },
  ];

  return (
    <div className="grid gap-5">
      {/* {fields.map(({ key, name, value }) => (
        <div key={key} className="grid w-full gap-1">
          <Label className="text-sm">{name}</Label>
          <Input
            className="text-md"
            placeholder={`Masukan ${name}`}
            type={typeof value === "number" ? "number" : "text"}
            value={value || ""}
            onChange={handleInputChange(key)}
          />
          {errors?.[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
        </div>
      ))} */}
      {biodatafields.map((item) =>
        item?.fields ? (
          <div key={item.key} className="flex gap-5">
            {item.fields.map(({ key, name, value }) => (
              <div key={key} className="grid w-full gap-1">
                <Label className="text-sm">{name}</Label>
                <Input
                  className="text-md"
                  placeholder={`Masukan ${name}`}
                  type={typeof value === "number" ? "number" : "text"}
                  value={value || ""}
                  onChange={handleInputChange(key)}
                />
                {errors?.[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
              </div>
            ))}
          </div>
        ) : (
          <div key={item.key} className="grid w-full gap-1">
            <Label className="text-sm">{item.name}</Label>
            <Input
              className="text-md"
              placeholder={`Masukan ${item.name}`}
              type={typeof item.value === "number" ? "number" : "text"}
              value={item.value || ""}
              onChange={handleInputChange(item.key)}
            />
            {errors?.[item.key] && <p className="text-red-500 text-xs">{errors[item.key]}</p>}
          </div>
        ),
      )}

      <div className="grid gap-1">
        <Label className="text-md">Alamat Perusahaan</Label>
        <div className="flex gap-5 mt-2">
          {locationFieldsCombobox.map(({ key, name, value }) => (
            <div key={key} className="grid gap-1 w-full">
              <Label className="text-sm">{name}</Label>
              <Combobox
                datas={
                  key === "province_id"
                    ? Array.isArray(provinces)
                      ? provinces
                      : []
                    : key === "regency_id"
                      ? Array.isArray(regencies)
                        ? regencies
                        : []
                      : key === "district_id"
                        ? Array.isArray(districts)
                          ? districts
                          : []
                        : []
                }
                labelKey="name"
                valueKey="id"
                placeholder={`Pilih ${name}`}
                defaultValueId={value}
                onSelect={(val) => {
                  onChangePrincipal(key, val.id);
                }}
              />
              {errors?.[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-5 items-start">
        {locationFieldsInput.map(({ key, name, value }) => (
          <div key={key} className="grid w-full gap-1">
            <Label className="text-sm">{name}</Label>
            {key === "address" ? (
              <Textarea
                className="text-md"
                placeholder={`Masukan ${name}`}
                value={value || ""}
                onChange={handleInputChange(key)}
              />
            ) : (
              <Input
                className="text-md"
                placeholder={`Masukan ${name}`}
                type={typeof value === "number" ? "number" : "text"}
                value={value || ""}
                onChange={handleInputChange(key)}
              />
            )}
            {errors?.[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrincipalSection;
