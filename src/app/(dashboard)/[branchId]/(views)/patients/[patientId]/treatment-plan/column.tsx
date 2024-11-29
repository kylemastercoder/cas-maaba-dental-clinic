/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction, UserWithRoles } from "./cell-action";

export type TreatmentColumn = {
  id: string;
  service: string;
  paymentMethod: string;
  amount: string;
  dentist: string;
  status: string;
  serviceId: string;
  dentistId: string;
  remarks: string;
  toothNumber: string;
  createdAt: string;
};

export type TreatmentColumn2 = {
  id: string;
  diagnosis: string;
  remarks: string;
  toothNumber: string;
  createdAt: string;
};

export const getColumns = (
  user: UserWithRoles
): ColumnDef<TreatmentColumn>[] => {
  const columns: ColumnDef<TreatmentColumn>[] = [
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
      header: "Treatment Rendered",
    },
    {
      accessorKey: "remarks",
      header: "Notes/Remarks",
    },
    {
      accessorKey: "dentist",
      header: "Dentist",
    },
    {
      accessorKey: "amount",
      header: "Amount",
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
  ];

  if (user?.role.name !== "Dentist") {
    columns.push({
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return <CellAction data={row.original} />;
      },
    });
  }

  return columns;
};

export const columns2: ColumnDef<TreatmentColumn2>[] = [
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
  {
    accessorKey: "toothNumber",
    header: "Tooth Number",
  },
  {
    accessorKey: "diagnosis",
    header: "Diagnosis",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
];
