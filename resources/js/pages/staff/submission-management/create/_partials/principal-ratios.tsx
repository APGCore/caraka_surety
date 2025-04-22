import { useCompareRatios } from "@/common/hooks/general/use-compare-ratios";
import { Badge } from "@/components/_shadcn-ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/_shadcn-ui/select";
import RenderList from "@/components/atoms/render-list";
import InputCurrency from "@/components/molecules/input/currency-input";
import { Ratio } from "@/pages/staff/submission-management/create/submission-create-page.type";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";

interface PrincipalRatiosProps {
  ratios: Ratio[];
  setRatio: (ratios: Ratio[]) => void;
}

const PrincipalRatios: React.FC<PrincipalRatiosProps> = ({ ratios, setRatio }) => {
  const { comparisonRatios, handleComparisonRatios } = useCompareRatios();

  const years: Array<number> = Array.from({ length: 20 }, (_, i) => dayjs().year() - i);

  const calculateRatios = (value1: string, value2: string) => {
    const result = (Number(value1) / Number(value2)).toString();

    return result === "Infinity" ? "" : isNaN(Number(result)) ? "" : result;
  };
  const defaultRatio: Ratio = {
    year: dayjs().year(),
    current_assets: "",
    current_debt: "",
    total_debt: "",
    total_assets: "",
    revenue: "",
    net_income: "",
  };
  const secondDefaultRatio = {
    ...defaultRatio,
    year: dayjs().year() - 1,
  };
  const [firstRatio, setFirstRatio] = useState<Ratio | undefined>();
  const [secondRatio, setSecondRatio] = useState<Ratio | undefined>();

  const setHandleAndRatios = (ratio: Ratio, first: boolean) => {
    const secondDefRatio = {
      ...defaultRatio,
      year: firstRatio?.year ? firstRatio?.year - 1 : dayjs().year() - 1,
    };
    if (first) {
      setFirstRatio(ratio);
      handleComparisonRatios([ratio, secondRatio ?? secondDefRatio]);
      setRatio([ratio, secondRatio ?? secondDefRatio]);
    } else {
      setSecondRatio(ratio);
      handleComparisonRatios([firstRatio ?? defaultRatio, ratio]);
      setRatio([firstRatio ?? defaultRatio, ratio]);
    }
  };

  useEffect(() => {
    const firstRatioSet: Ratio = ratios[0] ?? defaultRatio;
    const secondRatioSet: Ratio = ratios[1] ?? secondDefaultRatio;
    setFirstRatio(firstRatioSet);
    setSecondRatio(secondRatioSet);
    handleComparisonRatios([firstRatioSet, secondRatioSet]);
  }, []);

  return (
    <>
      <h2 className="text-xl font-semibold">Laporan Keuangan Perusahaan</h2>
      <div className="flex gap-8">
        <div className="grid gap-3 w-[550px]">
          <div className="pt-2 text-black h-[45px]">Tahun</div>
          <div className="pt-2 text-black h-[45px]">Aktiva Lancar</div>
          <div className="pt-2 text-black h-[45px]">Utang Lancar</div>
          <div className="pt-2 text-black h-[45px]">Total Utang</div>
          <div className="pt-2 text-black h-[45px]">Total Aktiva</div>
          <div className="pt-2 text-black h-[45px]">Pendapatan</div>
          <div className="pt-2 text-black h-[45px]">Laba Bersih</div>
          <div className="pt-2 text-black h-[45px] flex justify-between">
            Rasio Likuiditas
            {comparisonRatios.liquidity_ratios == true && (
              <Badge variant="success" className="flex-shrink-0 h-6">
                Naik
              </Badge>
            )}
            {comparisonRatios.liquidity_ratios == false && (
              <Badge variant="destructive" className="flex-shrink-0 h-6">
                Turun
              </Badge>
            )}
          </div>
          <div className="pt-2 text-black h-[45px] flex justify-between">
            Rasio Solvabilitas
            {comparisonRatios.solvency_ratios == true && (
              <Badge variant="success" className="flex-shrink-0 h-6">
                Naik
              </Badge>
            )}
            {comparisonRatios.solvency_ratios == false && (
              <Badge variant="destructive" className="flex-shrink-0 h-6">
                Turun
              </Badge>
            )}
          </div>
          <div className="pt-2 text-black h-[45px] flex justify-between">
            Rasio Profitabilitas
            {comparisonRatios.profitability_ratios == true && (
              <Badge variant="success" className="flex-shrink-0 h-6">
                Naik
              </Badge>
            )}
            {comparisonRatios.profitability_ratios == false && (
              <Badge variant="destructive" className="flex-shrink-0 h-6">
                Turun
              </Badge>
            )}
          </div>
        </div>
        {/* First Ratio */}
        <div className="grid gap-3 w-full">
          <div className="grid gap-1 h-[30px] w-full">
            <Select
              value={firstRatio?.year?.toString() ?? years[0].toString()}
              onValueChange={(year: string) => {
                const defaultRatioSelectedYear = {
                  ...defaultRatio,
                  year: Number(year),
                };
                const defaultRatioSecondSelectedYear = {
                  ...defaultRatio,
                  year: Number(year) - 1,
                };
                const dataRatio: Ratio | undefined =
                  ratios.find((r) => r.year === Number(year)) ?? defaultRatioSelectedYear;
                const dataRatioBefore: Ratio | undefined =
                  ratios.find((r) => r.year === Number(year) - 1) ?? defaultRatioSecondSelectedYear;
                setFirstRatio(dataRatio);
                setSecondRatio(dataRatioBefore);
                handleComparisonRatios([dataRatio, dataRatioBefore]);
                setRatio([dataRatio, dataRatioBefore]);
              }}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Tahun</SelectLabel>
                  <RenderList
                    of={years as any[]}
                    render={(year) => {
                      return <SelectItem value={year.toString()}>{year.toString()}</SelectItem>;
                    }}
                  />
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={firstRatio?.current_assets ?? ""}
              placeholder="Aktiva Lancar"
              onChange={(value) => {
                const liquidity = calculateRatios(value ?? "", firstRatio?.current_debt ?? "");
                const dataRatios = firstRatio
                  ? {
                      ...firstRatio,
                      current_assets: value ?? "",
                      liquidity_ratios: liquidity ?? "",
                    }
                  : defaultRatio;
                setFirstRatio(dataRatios);
                setHandleAndRatios(dataRatios, true);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={firstRatio?.current_debt ?? ""}
              placeholder="Utang Lancar"
              onChange={(value) => {
                const liquidity = calculateRatios(firstRatio?.current_assets ?? "", value ?? "");
                const dataRatios = firstRatio
                  ? {
                      ...firstRatio,
                      current_debt: value ?? "",
                      liquidity_ratios: liquidity ?? "",
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, true);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={firstRatio?.total_debt ?? ""}
              placeholder="Total Utang"
              onChange={(value) => {
                const solvency = calculateRatios(firstRatio?.total_assets ?? "", value ?? "");
                const dataRatios = firstRatio
                  ? {
                      ...firstRatio,
                      total_debt: value ?? "",
                      solvency_ratios: solvency ?? "",
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, true);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={firstRatio?.total_assets ?? ""}
              placeholder="Total Aktiva"
              onChange={(value) => {
                const solvency = calculateRatios(value ?? "", firstRatio?.total_debt ?? "");
                const dataRatios = firstRatio
                  ? {
                      ...firstRatio,
                      total_assets: value ?? "",
                      solvency_ratios: solvency ?? "",
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, true);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={firstRatio?.revenue ?? ""}
              placeholder="Pendapatan"
              onChange={(value) => {
                const profitability = calculateRatios(firstRatio?.net_income ?? "", value ?? "");
                const profit = profitability ? Number(profitability) * 100 : 0;
                const dataRatios = firstRatio
                  ? {
                      ...firstRatio,
                      revenue: value ?? "",
                      profitability_ratios: profit.toString(),
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, true);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={firstRatio?.net_income ?? ""}
              placeholder="Laba Bersih"
              onChange={(value) => {
                const profitability = calculateRatios(value ?? "", firstRatio?.revenue ?? "");
                const profit = profitability ? Number(profitability) * 100 : 0;
                const dataRatios = firstRatio
                  ? {
                      ...firstRatio,
                      net_income: value ?? "",
                      profitability_ratios: profit.toString(),
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, true);
              }}
            />
          </div>
          <div className="pt-2 h-[30px] w-full text-black">{firstRatio?.liquidity_ratios ?? "??"}</div>
          <div className="pt-2 h-[30px] w-full text-black">{firstRatio?.solvency_ratios ?? "??"}</div>
          <div className="pt-2 h-[30px] w-full text-black">
            {firstRatio?.profitability_ratios !== undefined ? firstRatio?.profitability_ratios.toString() + "%" : "??"}{" "}
          </div>
        </div>
        {/* Second Ratio */}
        <div className="grid gap-3 w-full">
          <div className="grid gap-1 h-[30px] w-full text-center">{secondRatio?.year?.toString()}</div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={secondRatio?.current_assets ?? ""}
              placeholder="Aktiva Lancar"
              onChange={(value) => {
                const liquidity = calculateRatios(value ?? "", secondRatio?.current_debt ?? "");
                const dataRatios = secondRatio
                  ? {
                      ...secondRatio,
                      current_assets: value ?? "",
                      liquidity_ratios: liquidity ?? "",
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, false);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={secondRatio?.current_debt ?? ""}
              placeholder="Utang Lancar"
              onChange={(value) => {
                const liquidity = calculateRatios(secondRatio?.current_assets ?? "", value ?? "");
                const dataRatios = secondRatio
                  ? {
                      ...secondRatio,
                      current_debt: value ?? "",
                      liquidity_ratios: liquidity ?? "",
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, false);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={secondRatio?.total_debt ?? ""}
              placeholder="Total Utang"
              onChange={(value) => {
                const solvency = calculateRatios(secondRatio?.total_assets ?? "", value ?? "");
                const dataRatios = secondRatio
                  ? {
                      ...secondRatio,
                      total_debt: value ?? "",
                      solvency_ratios: solvency ?? "",
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, false);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={secondRatio?.total_assets ?? ""}
              placeholder="Total Aktiva"
              onChange={(value) => {
                const solvency = calculateRatios(value ?? "", secondRatio?.total_debt ?? "");
                const dataRatios = secondRatio
                  ? {
                      ...secondRatio,
                      total_assets: value ?? "",
                      solvency_ratios: solvency ?? "",
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, false);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={secondRatio?.revenue ?? ""}
              placeholder="Pendapatan"
              onChange={(value) => {
                const profitability = calculateRatios(secondRatio?.net_income ?? "", value ?? "");
                const profit = profitability ? Number(profitability) * 100 : 0;
                const dataRatios = secondRatio
                  ? {
                      ...secondRatio,
                      revenue: value ?? "",
                      profitability_ratios: profit.toString(),
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, false);
              }}
            />
          </div>
          <div className="grid gap-1 h-[30px] w-full">
            <InputCurrency
              value={secondRatio?.net_income ?? ""}
              placeholder="Laba Bersih"
              onChange={(value) => {
                const profitability = calculateRatios(value ?? "", secondRatio?.revenue ?? "");
                const profit = profitability ? Number(profitability) * 100 : 0;
                const dataRatios = secondRatio
                  ? {
                      ...secondRatio,
                      net_income: value ?? "",
                      profitability_ratios: profit.toString(),
                    }
                  : defaultRatio;
                setHandleAndRatios(dataRatios, false);
              }}
            />
          </div>
          <div className="pt-2 h-[30px] w-full text-black">{secondRatio?.liquidity_ratios ?? "??"}</div>
          <div className="pt-2 h-[30px] w-full text-black">{secondRatio?.solvency_ratios ?? "??"}</div>
          <div className="pt-2 h-[30px] w-full text-black">
            {secondRatio?.profitability_ratios !== undefined
              ? secondRatio?.profitability_ratios.toString() + "%"
              : "??"}{" "}
          </div>
        </div>
      </div>
    </>
  );
};

export default PrincipalRatios;
