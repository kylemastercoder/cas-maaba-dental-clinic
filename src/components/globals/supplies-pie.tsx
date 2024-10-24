/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function SuppliesPie({ data }: { data: any[] }) {
  return (
    <Card className="md:h-[450px]">
      <CardHeader className="pb-0">
        <CardTitle>Supplies of Cas-Maaba Dental Clinic</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{
            SuppliesUsed: {
              label: "Supplies Used",
              color: "hsl(var(--chart-5))",
            },
            RemainingSupplies: {
              label: "Remaining Supplies",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="mx-auto pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent />} />
            <Pie
              height={200}
              data={data}
              dataKey="value"
              label={({ name, value }) => `${name} = ${value}`}
              nameKey="label"
            />
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
