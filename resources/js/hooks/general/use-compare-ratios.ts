import { Ratio } from "@/pages/staff/submission-management/create/create-page.type";
import { useState } from "react";

export function useCompareRatios() {
  const [comparisonRatios, setComparisonRatios] = useState<{
    liquidity_ratios?: boolean;
    solvency_ratios?: boolean;
    profitability_ratios?: boolean;
  }>({});

  const handleComparisonRatios = (ratios: Ratio[]) => {
    setComparisonRatios({
      liquidity_ratios: ratios[0].liquidity_ratios
        ? Number(ratios[0].liquidity_ratios) > Number(ratios[1].liquidity_ratios)
        : undefined,
      solvency_ratios: ratios[0].solvency_ratios
        ? Number(ratios[0].solvency_ratios) > Number(ratios[1].solvency_ratios)
        : undefined,
      profitability_ratios: ratios[0].profitability_ratios
        ? Number(ratios[0].profitability_ratios) > Number(ratios[1].profitability_ratios)
        : undefined,
    });
  };

  return { comparisonRatios, handleComparisonRatios };
}
