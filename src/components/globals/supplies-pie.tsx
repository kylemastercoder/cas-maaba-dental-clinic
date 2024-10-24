"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

const chartConfig = {
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function SuppliesPie() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-0">
        <CardTitle>Supplies of Cas-Maaba</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie height={200} data={chartData} dataKey="visitors" label nameKey="browser" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <div className="bg-[hsl(var(--chart-5))] w-3 h-3 rounded-full"></div>
          Supplies Used
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-[hsl(var(--chart-3))] w-3 h-3 rounded-full"></div>
          Remaining Supplies
        </div>
      </CardFooter>
    </Card>
  );
}
