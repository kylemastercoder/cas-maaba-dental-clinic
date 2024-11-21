"use client";

import { useState, useEffect } from "react";
import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

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
  date: string;
}

const getStartOfWeek = (): Date => {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  return startOfWeek;
};

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

// Normalize percentages to ensure they sum to 100%
const normalizePercentages = (data: DataItem[]): DataItem[] => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const discrepancy = 100 - total;

  if (discrepancy !== 0 && data.length > 0) {
    const largest = data.reduce((prev, current) =>
      current.value > prev.value ? current : prev
    );
    largest.value = parseFloat((largest.value + discrepancy).toFixed(2));
  }

  return data;
};

interface PatientLocationProps {
  data: DataItem[];
}

export function PatientLocation({ data }: PatientLocationProps) {
  const [filter, setFilter] = useState<"Weekly" | "Monthly" | "Yearly">(
    "Weekly"
  );
  const [filteredData, setFilteredData] = useState<DataItem[]>([]);

  useEffect(() => {
    let updatedData: DataItem[] = [];

    if (filter === "Weekly") {
      updatedData = filterWeeklyData(data);
    } else if (filter === "Monthly") {
      updatedData = filterMonthlyData(data);
    } else if (filter === "Yearly") {
      updatedData = filterYearlyData(data);
    }

    // Recalculate percentages
    const total = updatedData.reduce((sum, item) => sum + item.value, 0);
    const normalizedData = updatedData.map((item) => ({
      ...item,
      value: parseFloat(((item.value / total) * 100).toFixed(2)),
    }));

    setFilteredData(normalizePercentages(normalizedData));
  }, [filter, data]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle>Patient Location Distribution</CardTitle>
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
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label={({ name, value }: { name: string; value: number }) =>
                `${name}: ${value.toFixed(2)}%`
              }
            >
              {filteredData.map((entry, index) => (
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
        {filteredData.map((entry, index) => (
          <div key={index} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            {entry.label}: {entry.value.toFixed(2)}%
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
