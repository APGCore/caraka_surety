import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import axios from "axios";
import React, { useEffect, useState } from "react";

type InputRegencyProps = {
  province_id: number | null;
  regency_id: number | null;
  setRegencyId: (value: number | null) => void;
  error_regency_id?: string;
};

const InputRegency: React.FC<InputRegencyProps> = ({ province_id, regency_id, setRegencyId, error_regency_id }) => {
  const [regencies, setRegencies] = useState([]);

  useEffect(() => {
    if (province_id) {
      setRegencies([]);
      axios
        .get(route("regency.by-province", province_id))
        .then((response) => {
          setRegencies(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [province_id]);

  return (
    <div>
      <InputLabel htmlFor="regency_id" value="Kabupaten/Kota" />

      <Combobox
        datas={regencies}
        labelKey="name"
        valueKey="id"
        defaultValue={regency_id ?? ""}
        onSelect={(value) => setRegencyId(value.id)}
        placeholder="Pilih Kabupaten/Kota..."
        notFoundText="Kabupaten/Kota tidak ditemukan."
        className="mt-1 w-full"
      />

      <InputError className="mt-2" message={error_regency_id} />
    </div>
  );
};

export default InputRegency;
