/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Pie, PieChart, Cell } from "recharts";
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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#d0ed57", "#8dd1e1"];

export function PatientLocation({ data }: { data: any[] }) {
  return (
    <Card className="md:h-[405px] w-full">
      <CardHeader className="pb-0">
        <CardTitle>Patient Location Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
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
              fill="#8884d8"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-wrap items-center gap-3 text-sm">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            {entry.label}
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
