import { Tooltip, TooltipContent, TooltipTrigger } from "@/_features/_common/components/_shadcn-ui/tooltip";
import {
  useGetAllProvince,
  useGetDistrictByRegencyId,
  useGetRegencyByProvinceId,
} from "@/common/hooks/react-query/location";
import { getNumericValue } from "@/common/utils/get-numeric-value";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import { Combobox } from "@/components/molecules/combobox";
import { InfoIcon } from "lucide-react";
import React from "react";

interface PrincipalSectionProps {
  province_id?: string;
  regency_id?: string;
  district_id?: string;
  village: string;
  name: string;
  address: string;
  postal_code: string;
  telephone?: number | string | undefined;
  fax: string;
  npwp?: number | string | undefined;
  nib?: number | string | undefined;
  siup_siujk: string;
  head_name: string;
  director_name: string;
  director_position: string;
  director_phone?: number | string | undefined;
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

  const biodatafields: any = [
    { key: "name", name: "Nama", value: name, type: "text" },
    {
      key: "business_info",
      name: "Informasi Bisnis",
      type: "text",
      fields: [
        { key: "telephone", name: "Nomor Telepon", value: telephone, type: "number" },
        {
          key: "npwp",
          name: "NPWP",
          value: npwp,
          type: "number",
          helperText: "NPWP harus berupa angka dan minimal 15 karakter",
        },
        { key: "nib", name: "NIB", value: nib, type: "text" },
      ],
    },
    {
      key: "director_info",
      name: "Informasi Direktur",
      type: "text",
      fields: [
        { key: "director_name", name: "Nama Direktur", value: director_name, type: "text" },
        { key: "director_phone", name: "Nomor Telepon Direktur", value: director_phone, type: "number" },
        { key: "director_position", name: "Jabatan", value: director_position, type: "text" },
      ],
    },
    {
      key: "commissioner",
      name: "Komisioner",
      type: "text",
      fields: [
        { key: "commissioner", name: "Nama Komisaris", value: commissioner, type: "text" },
        { key: "business_fields", name: "Bidang Usaha", value: business_fields, type: "text" },
      ],
    },
    {
      key: "deeds",
      name: "Dokumen Akta",
      type: "text",
      fields: [
        {
          key: "year_established",
          name: "Tahun Perusahaan Berdiri",
          value: year_established,
          type: "number",
          maxLength: 4,
        },
        {
          key: "est_deed",
          name: "Akte Pendirian",
          value: est_deed,
          type: "text",
          tooltip: "Isi dengan format Nomor {Angka} Tahun {Angka}",
        },
        { key: "last_deed", name: "Akte Perubahan Terakhir", value: last_deed, type: "text" },
      ],
    },
  ];

  const locationFieldsCombobox = [
    { key: "province_id", name: "Provinsi", value: Number(province_id) },
    { key: "regency_id", name: "Kabupaten", value: Number(regency_id) },
    { key: "district_id", name: "Kecamatan", value: Number(district_id) },
  ];

  const locationFieldsInput = [
    { key: "village", name: "Desa", value: village, type: "text" },
    { key: "address", name: "Alamat", value: address, type: "text" },
    { key: "postal_code", name: "Kode Pos", value: postal_code, type: "number" },
  ];

  return (
    <div className="grid gap-5">
      {biodatafields.map((item: any) =>
        item?.fields ? (
          <div key={item.key} className="flex gap-5 items-start">
            {item.fields.map(
              ({
                key,
                name,
                value,
                type,
                tooltip,
                maxLength,
                helperText,
              }: {
                key: any;
                name: any;
                value: any;
                type?: "text" | "number";
                tooltip?: string;
                maxLength?: number;
                helperText?: string;
              }) => (
                <div key={key} className="grid w-full gap-1">
                  <Label className="text-sm flex items-center gap-1">
                    {name}
                    {tooltip && (
                      <Tooltip>
                        <TooltipTrigger
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}>
                          <InfoIcon className="w-4 h-4" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </Label>

                  <Input
                    className="text-md"
                    placeholder={`Masukan ${name}`}
                    type={"text"}
                    value={value || ""}
                    onChange={(e) => {
                      if (type === "number") {
                        const v = e.target.value;
                        if (/^\d*$/.test(v)) {
                          // hanya digit
                          handleInputChange(key)(e);
                        }
                      } else {
                        handleInputChange(key)(e);
                      }
                    }}
                    maxLength={maxLength}
                  />
                  {helperText && <p className="text-gray-500 text-xs">{helperText}</p>}
                  {errors?.[key] && <p className="text-red-500 text-xs">{errors[key]}</p>}
                </div>
              ),
            )}
          </div>
        ) : (
          <div key={item.key} className="grid w-full gap-1">
            <Label className="text-sm">{item.name}</Label>
            <Input
              className="text-md"
              placeholder={`Masukan ${item.name}`}
              type={item.type}
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
        {locationFieldsInput.map(({ key, name, value, type }) => (
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
                type={type}
                value={value || ""}
                onChange={(e) => {
                  handleInputChange(key)(e);
                }}
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
