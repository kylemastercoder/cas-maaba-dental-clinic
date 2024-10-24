"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  { month: "0-18 years old", desktop: 186, mobile: 80 },
  { month: "19-35 years old", desktop: 305, mobile: 200 },
];

const chartConfig = {
  desktop: {
    label: "Male",
    color: "#125b9a",
  },
  mobile: {
    label: "Female",
    color: "#f05a7e",
  },
} satisfies ChartConfig;

export function AgeSexBar() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Age Bracket Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={true}
              tickMargin={5}
              axisLine={true}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex items-center gap-3 text-sm">
        <div className="flex items-center gap-1">
          <div className="bg-[#125b9a] w-3 h-3 rounded-full"></div>
          Male
        </div>
        <div className="flex items-center gap-1">
          <div className="bg-[#f05a7e] w-3 h-3 rounded-full"></div>
          Female
        </div>
      </CardFooter>
    </Card>
  );
}
