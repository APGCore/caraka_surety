import { Ratio } from "@/pages/staff/submission-management/create/submission-create-page.type";
import { useState } from "react";

export function useCompareRatios() {
  const [comparisonRatios, setComparisonRatios] = useState<{
    liquidity_ratios?: boolean;
    solvency_ratios?: boolean;
    profitability_ratios?: boolean;
  }>({});

  const handleComparisonRatios = (ratios: Ratio[]) => {
    if (ratios.length < 2) {
      setComparisonRatios({
        liquidity_ratios: undefined,
        solvency_ratios: undefined,
        profitability_ratios: undefined,
      });
    } else {
      setComparisonRatios({
        liquidity_ratios: Number(ratios[0].liquidity_ratios) > Number(ratios[1].liquidity_ratios),
        solvency_ratios: Number(ratios[0].solvency_ratios) > Number(ratios[1].solvency_ratios),
        profitability_ratios: Number(ratios[0].profitability_ratios) > Number(ratios[1].profitability_ratios),
      });
    }
  };
  return { comparisonRatios, handleComparisonRatios };
}
