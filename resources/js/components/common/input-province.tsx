import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import axios from "axios";
import React, { useEffect, useState } from "react";

type InputProvinceProps = {
  province_id: number | null;
  setProvinceId: (value: number | null) => void;
  error_province_id?: string;
};

const InputProvince: React.FC<InputProvinceProps> = ({ province_id, setProvinceId, error_province_id }) => {
  const [provinces, setProvinces] = useState([]);

  useEffect(() => {
    axios
      .get(route("province.all"))
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <InputLabel htmlFor="province_id" value="Provinsi" />

      <Combobox
        datas={provinces}
        labelKey="name"
        valueKey="id"
        defaultValue={province_id ?? ""}
        onSelect={(value) => setProvinceId(value.id)}
        placeholder="Pilih Provinsi..."
        notFoundText="Provinsi tidak ditemukan."
        className="mt-1 w-full"
      />

      <InputError className="mt-2" message={error_province_id} />
    </div>
  );
};

export default InputProvince;
