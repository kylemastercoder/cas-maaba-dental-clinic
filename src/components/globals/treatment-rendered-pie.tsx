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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#d0ed57",
  "#8dd1e1",
];

interface DataItem {
  label: string;
  value: number;
  date: string; // Expecting date as a string in a valid format (e.g., YYYY-MM-DD)
}

// Get the start of the current week
const getStartOfWeek = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  return startOfWeek;
};

// Filtering functions
const filterWeeklyData = (data: DataItem[]): DataItem[] => {
  const startOfWeek = getStartOfWeek();
  return data.filter((item) => new Date(item.date) >= startOfWeek);
};

const filterMonthlyData = (data: DataItem[]): DataItem[] => {
  const now = new Date();
  return data.filter((item) => {
    const itemDate = new Date(item.date);
    return (
      itemDate.getFullYear() === now.getFullYear() &&
      itemDate.getMonth() === now.getMonth()
    );
  });
};

const filterYearlyData = (data: DataItem[]): DataItem[] => {
  const now = new Date();
  return data.filter(
    (item) => new Date(item.date).getFullYear() === now.getFullYear()
  );
};

interface TreatmentRenderedProps {
  data: DataItem[];
}

export function TreatmentRenderedPie({ data }: TreatmentRenderedProps) {
  const [filter, setFilter] = useState<"Weekly" | "Monthly" | "Yearly">(
    "Weekly"
  );
  const [filteredData, setFilteredData] = useState<DataItem[]>(data);

  useEffect(() => {
    console.log("Selected Filter:", filter); // Debugging: Check selected filter
    let updatedData: DataItem[] = [];

    if (filter === "Weekly") {
      updatedData = filterWeeklyData(data);
    } else if (filter === "Monthly") {
      updatedData = filterMonthlyData(data);
    } else if (filter === "Yearly") {
      updatedData = filterYearlyData(data);
    }

    setFilteredData(updatedData);
    console.log("Filtered Data:", updatedData); // Debugging: Check filtered data
  }, [filter, data]);
  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Treatment Rendered Distribution</CardTitle>
          <Select
            onValueChange={(value) =>
              setFilter(value as "Weekly" | "Monthly" | "Yearly")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
              data={filteredData}
              dataKey="value"
              label={({ name, value }) => `${name} = ${value}`}
              nameKey="label"
              fill="#8884d8"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
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
