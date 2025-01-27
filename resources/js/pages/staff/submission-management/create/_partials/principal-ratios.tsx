import InputCurrency from "@/components/common/input-currency";
import RenderList from "@/components/common/render-list";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCompareRatios } from "@/hooks/general/use-compare-ratios";
import { Ratio } from "@/pages/staff/submission-management/create/create-page.type";
import dayjs from "dayjs";
import React, { useEffect } from "react";

interface PrincipalRatiosProps {
  ratios: Ratio[];
  setRatio: (ratios: Ratio[]) => void;
  defaultPrincipalRatios: Ratio;
}

const PrincipalRatios: React.FC<PrincipalRatiosProps> = ({ ratios, setRatio, defaultPrincipalRatios }) => {
  const { comparisonRatios, handleComparisonRatios } = useCompareRatios();

  const years: Array<number> = Array.from({ length: 20 }, (_, i) => dayjs().year() - i);
  const calculateRatios = (value1: string, value2: string) => {
    const result = (Number(value1) / Number(value2)).toFixed(2);

    return result === "Infinity" ? undefined : isNaN(Number(result)) ? undefined : result;
  };

  useEffect(() => {
    handleComparisonRatios(ratios);
  }, [ratios]);

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
        </div>
        <RenderList
          of={ratios}
          render={(ratio, index) => {
            return (
              <div className="grid gap-3 w-full">
                <div className="grid gap-1 h-[30px] w-full">
                  <Select
                    value={ratio.year?.toString() ?? years[index].toString()}
                    onValueChange={(year) => {
                      const dataRatios = ratios.map((ratio, i) =>
                        i === index ? { ...ratio, year: Number(year) } : ratio,
                      );
                      setRatio(dataRatios);
                    }}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pilih Tahun" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Tahun</SelectLabel>
                        <RenderList
                          of={years}
                          render={(year) => {
                            return <SelectItem value={year.toString()}>{year}</SelectItem>;
                          }}
                        />
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1 h-[30px] w-full">
                  <InputCurrency
                    value={ratio?.current_assets ?? ""}
                    placeholder="Aktiva Lancar"
                    onChange={(value) => {
                      const liquidity = calculateRatios(value ?? "", ratio.current_debt ?? "");
                      const dataRatios = ratios.map((r, i) => {
                        if (i === index) {
                          return {
                            ...r,
                            current_assets: value ?? "",
                            liquidity_ratios: liquidity ?? "",
                          };
                        }
                        return r;
                      });
                      setRatio(dataRatios);
                      handleComparisonRatios(dataRatios);
                    }}
                  />
                </div>
                <div className="grid gap-1 h-[30px] w-full">
                  <InputCurrency
                    value={ratio.current_debt ?? ""}
                    placeholder="Utang Lancar"
                    onChange={(value) => {
                      const liquidity = calculateRatios(ratio.current_assets ?? "", value ?? "");
                      const dataRatios = ratios.map((r, i) => {
                        if (i === index) {
                          return {
                            ...r,
                            current_debt: value ?? "",
                            liquidity_ratios: liquidity ?? "",
                          };
                        }
                        return r;
                      });
                      setRatio(dataRatios);
                      handleComparisonRatios(dataRatios);
                    }}
                  />
                </div>
                <div className="grid gap-1 h-[30px] w-full">
                  <InputCurrency
                    value={ratio.total_debt ?? ""}
                    placeholder="Total Utang"
                    onChange={(value) => {
                      const solvency = calculateRatios(ratio.total_assets ?? "", value ?? "");
                      const dataRatios = ratios.map((r, i) => {
                        if (i === index) {
                          return {
                            ...r,
                            total_debt: value ?? "",
                            solvency_ratios: solvency ?? "",
                          };
                        }
                        return r;
                      });
                      setRatio(dataRatios);
                      handleComparisonRatios(dataRatios);
                    }}
                  />
                </div>
                <div className="grid gap-1 h-[30px] w-full">
                  <InputCurrency
                    value={ratio.total_assets ?? ""}
                    placeholder="Total Aktiva"
                    onChange={(value) => {
                      const solvency = calculateRatios(value ?? "", ratio.total_debt ?? "");
                      const dataRatios = ratios.map((r, i) => {
                        if (i === index) {
                          return {
                            ...r,
                            total_assets: value ?? "",
                            solvency_ratios: solvency ?? "",
                          };
                        }
                        return r;
                      });
                      setRatio(dataRatios);
                      handleComparisonRatios(dataRatios);
                    }}
                  />
                </div>
                <div className="grid gap-1 h-[30px] w-full">
                  <InputCurrency
                    value={ratio.revenue ?? ""}
                    placeholder="Pendapatan"
                    onChange={(value) => {
                      const profitability = calculateRatios(value ?? "", ratio.net_income ?? "");
                      const profit = profitability ? (Number(profitability) * 100).toFixed(2) : 0;
                      const dataRatios = ratios.map((r, i) => {
                        if (i === index) {
                          return {
                            ...r,
                            revenue: value ?? "",
                            profitability_ratios: profit.toString(),
                          };
                        }
                        return r;
                      });
                      setRatio(dataRatios);
                      handleComparisonRatios(dataRatios);
                    }}
                  />
                </div>
                <div className="grid gap-1 h-[30px] w-full">
                  <InputCurrency
                    value={ratio.net_income ?? ""}
                    placeholder="Laba Bersih"
                    onChange={(value) => {
                      const profitability = calculateRatios(ratio.revenue ?? "", value ?? "");
                      const profit = profitability ? (Number(profitability) * 100).toFixed(2) : 0;
                      const dataRatios = ratios.map((r, i) => {
                        if (i === index) {
                          return {
                            ...r,
                            net_income: value ?? "",
                            profitability_ratios: profit.toString(),
                          };
                        }
                        return r;
                      });
                      setRatio(dataRatios);
                      handleComparisonRatios(dataRatios);
                    }}
                  />
                </div>
                <div className="pt-2 h-[30px] w-full text-black">{ratio.liquidity_ratios ?? "??"}</div>
                <div className="pt-2 h-[30px] w-full text-black">
                  {ratio.profitability_ratios !== undefined ? ratio.profitability_ratios.toString() + "%" : "??"}{" "}
                </div>
                <div className="pt-2 h-[30px] w-full text-black">{ratio.solvency_ratios ?? "??"}</div>
              </div>
            );
          }}
        />
      </div>
    </>
  );
};

export default PrincipalRatios;
