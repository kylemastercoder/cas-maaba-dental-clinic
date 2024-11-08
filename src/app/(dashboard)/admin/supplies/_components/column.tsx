/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

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
    header: "SKU",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "used",
    header: "Used",
  },
  {
    accessorKey: "stocks",
    header: "Stocks",
  },
  {
    accessorKey: "remaining",
    header: "Remaining",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
