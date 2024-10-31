/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type TreatmentColumn = {
  id: string;
  service: string;
  diagnosis: string;
  serviceId: string;
  paymentMethod: string;
  status: string;
  remarks: string;
  toothNumber: number;
  createdAt: string;
};

export const columns: ColumnDef<TreatmentColumn>[] = [
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    accessorKey: "toothNumber",
    header: "Tooth Number",
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "diagnosis",
    header: "Diagnosis",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "Paid" ? "default" : "secondary"}
      >
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <CellAction data={row.original} />
    )
  },
];
