/* eslint-disable @typescript-eslint/no-explicit-any */
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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  male: {
    label: "Male",
    color: "#125b9a",
  },
  female: {
    label: "Female",
    color: "#f05a7e",
  },
};

export function AgeSexBar({ data }: { data: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Age Bracket Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={true} tickMargin={5} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="male" fill={chartConfig.male.color} radius={8} />
            <Bar dataKey="female" fill={chartConfig.female.color} radius={8} />
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
