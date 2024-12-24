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
  const [thisProvinceId, setThisProvinceId] = useState(() => province_id);
  const [regencies, setRegencies] = useState([]);
  const [thisRegencyId, setThisRegencyId] = useState(() => regency_id);
  const [resetRegencyId, setResetRegencyId] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [thisDistrictId, setThisDistrictId] = useState(() => district_id);
  const [resetDistrictId, setResetDistrictId] = useState(false);

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
    if (thisProvinceId) {
      setRegencies([]);
      setDistricts([]);
      axios
        .get(route("regency.by-province", thisProvinceId))
        .then((response) => {
          setRegencies(response.data);
          setResetRegencyId(false);
          setResetDistrictId(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [thisProvinceId]);

  useEffect(() => {
    if (thisRegencyId) {
      setDistricts([]);
      axios
        .get(route("district.by-regency", thisRegencyId))
        .then((response) => {
          setDistricts(response.data);
          setResetDistrictId(false);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [thisRegencyId]);

  return (
    <>
      <div className="space-y-2">
        <InputLabel htmlFor="province_id" value="Provinsi" />

        <Combobox
          datas={provinces}
          labelKey="name"
          valueKey="name"
          defaultValueId={thisProvinceId ?? ""}
          onSelect={(value) => {
            setThisProvinceId(value.id);
            setProvinceId(value.id);
            setThisRegencyId(null);
            setThisDistrictId(null);
            setResetRegencyId(true);
          }}
          placeholder="Pilih Provinsi..."
          notFoundText="Provinsi tidak ditemukan."
          className="mt-1 w-full"
        />

        <InputError className="mt-2" message={error_province_id} />
      </div>
      <div className="space-y-2">
        <InputLabel htmlFor="regency_id" value="Kabupaten/Kota" />

        <Combobox
          datas={regencies}
          labelKey="name"
          valueKey="name"
          defaultValueId={thisRegencyId ?? ""}
          reset={resetRegencyId}
          onSelect={(value) => {
            setThisRegencyId(value.id);
            setRegencyId(value.id);
            setThisDistrictId(null);
            setResetDistrictId(true);
          }}
          placeholder="Pilih Kabupaten/Kota..."
          notFoundText="Kabupaten/Kota tidak ditemukan."
          className="mt-1 w-full"
        />

        <InputError className="mt-2" message={error_regency_id} />
      </div>
      <div className="space-y-2">
        <InputLabel htmlFor="district_id" value="Kecamatan" />

        <Combobox
          datas={districts}
          labelKey="name"
          valueKey="name"
          defaultValueId={thisDistrictId ?? ""}
          reset={resetDistrictId}
          onSelect={(value) => {
            setThisDistrictId(value.id);
            setDistrictId(value.id);
          }}
          placeholder="Pilih Kecamatan..."
          notFoundText="Kecamatan tidak ditemukan."
          className="mt-1 w-full"
        />

        <InputError className="mt-2" message={error_district_id} />
      </div>
      <div className="space-y-2">
        <InputLabel htmlFor="village" value="Desa/Kelurahan" />

        <TextInput
          id="village"
          className="mt-1 block w-full"
          value={village}
          onChange={(e) => setVillage(e.target.value)}
          autoComplete="village"
          placeholder="Masukan Desa/Kelurahan"
        />

        <InputError className="mt-2" message={error_village} />
      </div>
    </>
  );
};

export default InputLocation;
