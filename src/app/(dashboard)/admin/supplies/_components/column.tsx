/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ArrowUpDown, Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export type SupplyColumn = {
  id: string;
  name: string;
  category: string;
  sku: string;
  used: number;
  stocks: number;
  unitId: string;
  remaining: number;
  branch: string;
  unit: string;
  createdAt: string;
  branchId: string;
};

export const columns = (
  handleStockChange: (id: string, change: number) => void
): ColumnDef<SupplyColumn>[] => [
  {
    accessorKey: "sku",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        SKU
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Unit
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Category
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "used",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Used
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "stocks",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Stocks
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
    cell: ({ row }) => {
      const [inputValue, setInputValue] = useState(
        row.original.stocks.toString()
      );

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Update local input value on change
        setInputValue(e.target.value);
      };

      const handleBlur = () => {
        const newStockValue = parseInt(inputValue, 10);
        if (!isNaN(newStockValue)) {
          // Update stock in the parent state and backend
          handleStockChange(
            row.original.id,
            newStockValue - row.original.stocks
          );
        } else {
          setInputValue(row.original.stocks.toString()); // Revert to original if invalid input
        }
      };

      return (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleStockChange(row.original.id, -1)}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Input
            className="w-16"
            type="number"
            min={1}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
          />
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleStockChange(row.original.id, 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Remaining
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "branch",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Branch
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date Created
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </span>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
