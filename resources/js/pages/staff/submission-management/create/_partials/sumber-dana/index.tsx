import { Combobox } from "@/components/common/combobox";
import React from "react";
import { sumberDanaOptions } from "./sumber-dana.contant";

interface SumberDanaPengajuanSelectProps {
  placeholder?: string;
}

const SumberDanaPengajuanSelect: React.FC<SumberDanaPengajuanSelectProps> = ({ placeholder }) => {
  return (
    <Combobox
      datas={sumberDanaOptions}
      labelKey="label"
      valueKey="label"
      onSelect={(value) => {
        console.log(value);
      }}
      placeholder={placeholder || "Pilih Sumber Dana"}
      notFoundText="Sumber Dana tidak ditemukan."
      className="w-full"
    />
  );
};

export default SumberDanaPengajuanSelect;
