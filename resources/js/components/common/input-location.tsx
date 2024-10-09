import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import InputLabel from "@/components/common/input-label";
import TextInput from "@/components/common/text-input";
import axios from "axios";
import React, { useEffect, useState } from "react";

type Props = {
  province_id: number | null;
  setProvinceId: (value: number | null) => void;
  error_province_id?: string;
  regency_id: number | null;
  setRegencyId: (value: number | null) => void;
  error_regency_id?: string;
  district_id: number | null;
  setDistrictId: (value: number | null) => void;
  error_district_id?: string;
  village: string | "";
  setVillage: (value: string | "") => void;
  error_village?: string;
};

const InputLocation: React.FC<Props> = ({
  province_id,
  setProvinceId,
  error_province_id,
  regency_id,
  setRegencyId,
  error_regency_id,
  district_id,
  setDistrictId,
  error_district_id,
  village,
  setVillage,
  error_village,
}) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);

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

  useEffect(() => {
    if (province_id) {
      setRegencies([]);
      setDistricts([]);
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
    <>
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
      <div>
        <InputLabel htmlFor="village" value="Desa/Kelurahan" />

        <TextInput
          id="village"
          className="mt-1 block w-full"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          required
          autoComplete="village"
        />
        <InputError className="mt-2" message={error_village} />
      </div>
    </>
  );
};

export default InputLocation;
