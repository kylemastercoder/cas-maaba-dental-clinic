/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import { ArrowUpDown } from "lucide-react";

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

export const columns: ColumnDef<SupplyColumn>[] = [
  {
    accessorKey: "sku",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "unit",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Unit
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "used",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Used
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "stocks",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stocks
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "remaining",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Remaining
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "branch",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Branch
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
