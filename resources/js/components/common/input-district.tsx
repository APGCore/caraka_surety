import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import axios from "axios";
import React, { useEffect, useState } from "react";

type InputDistrictProps = {
  regency_id: number | null;
  district_id: number | null;
  setDistrictId: (value: number | null) => void;
  error_district_id?: string;
};

const InputDistrict: React.FC<InputDistrictProps> = ({ regency_id, district_id, setDistrictId, error_district_id }) => {
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    if (regency_id) {
      setDistricts([]);
      axios
        .get(route("district.by-regency", regency_id))
        .then((response) => {
          setDistricts(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [regency_id]);

  return (
    <div>
      <InputLabel htmlFor="district_id" value="Kecamatan" />

      <Combobox
        datas={districts}
        labelKey="name"
        valueKey="id"
        defaultValue={district_id ?? ""}
        onSelect={(value) => setDistrictId(value.id)}
        placeholder="Pilih Kecamatan..."
        notFoundText="Kecamatan tidak ditemukan."
        className="mt-1 w-full"
      />

      <InputError className="mt-2" message={error_district_id} />
    </div>
  );
};

export default InputDistrict;
