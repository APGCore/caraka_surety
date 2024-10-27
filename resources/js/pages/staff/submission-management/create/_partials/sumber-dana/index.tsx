import { Combobox } from "@/components/common/combobox";
import { sumberDanaOptions } from "./sumber-dana.contant";

const SumberDanaPengajuanSelect = () => {
  return (
    <Combobox
      datas={sumberDanaOptions}
      labelKey="label"
      valueKey="label"
      onSelect={(value) => {
        console.log(value);
      }}
      placeholder="Pilih Sumber Dana..."
      notFoundText="Sumber Dana tidak ditemukan."
      className="w-full"
    />
  );
};

export default SumberDanaPengajuanSelect;
