import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/_shadcn-ui/select";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { Combobox } from "@/components/molecules/combobox";
import React from "react";

interface FilterOfficeProps {
  offices: any[];
  officeTypes: any[];
  officeTypeSelected: string;
  officeSelected: number;
  handleSelectOfficeType: (officeType: string) => void;
  handleSelectOffice: (officeId: number) => void;
  handleReset: () => void;
}

const FilterOffice: React.FC<FilterOfficeProps> = ({
  offices,
  officeTypes,
  officeTypeSelected,
  officeSelected,
  handleSelectOfficeType,
  handleSelectOffice,
  handleReset,
}) => {
  return (
    <>
      <Select onValueChange={(value) => handleSelectOfficeType(value)} value={String(officeTypeSelected)}>
        <SelectTrigger className="min-w-[160px]">
          <SelectValue placeholder="Pilih " />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <RenderList
              of={officeTypes}
              render={(officeType: string) => <SelectItem value={officeType}>{officeType}</SelectItem>}
            />
          </SelectGroup>
        </SelectContent>
      </Select>
      <Show when={officeTypeSelected !== officeTypes[0]}>
        <Combobox
          datas={offices}
          labelKey={"name"}
          valueKey={"name"}
          defaultValue={officeSelected}
          placeholder={"Pilih Kantor"}
          className={"min-w-[160px]"}
          onSelect={(value) => handleSelectOffice(value.id)}
          isReset={true}
          handleReset={() => handleReset()}
        />
      </Show>
    </>
  );
};

export default FilterOffice;
