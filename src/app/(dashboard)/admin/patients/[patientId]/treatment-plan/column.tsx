/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type TreatmentColumn = {
  id: string;
  service: string;
  diagnosis: string;
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
    accessorKey: "remarks",
    header: "Remarks",
  },
];
