/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import React from "react";
import AddStockModal from "./add-stock-modal";
import DeductStockModal from "./deduct-stock-modal";

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
        Supply Name
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
    accessorKey: "actions",
    header: "Add Stock",
    cell: ({ row }) => <AddStockModal data={row.original} />,
  },
  {
    accessorKey: "action",
    header: "Deduct Stock",
    cell: ({ row }) => <DeductStockModal data={row.original} />,
  },
  {
    accessorKey: "stocks",
    header: ({ column }) => (
      <span
        className="flex items-center cursor-pointer"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Quantity
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
];
