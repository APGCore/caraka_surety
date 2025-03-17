import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/_shadcn-ui/chart";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { OverviewProps } from "./overview.type";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "#2563eb",
    },
    mobile: {
        label: "Mobile",
        color: "#60a5fa",
    },
} satisfies ChartConfig;

const Overview: React.FC<OverviewProps> = ({ data }) => {
    return (
        <ChartContainer config={chartConfig}>
            <BarChart data={data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />

                <YAxis
                    min={0}
                    allowDecimals={false}
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value: any) => {
                        if (value >= 1000000) {
                            return `${value / 1000000}B`;
                        } else if (value >= 1000) {
                            return `${value / 1000}M`;
                        }
                        return value.toString();
                    }}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
            </BarChart>
        </ChartContainer>
    );
};

export { Overview };
