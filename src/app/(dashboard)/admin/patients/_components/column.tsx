/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export type PatientColumn = {
  id: string;
  name: string;
  address: string;
  sex: string;
  age: any;
  contactNumber: string;
  createdAt: string;
};

export const columns: ColumnDef<PatientColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "sex",
    header: "Sex",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "contactNumber",
    header: "Contact Number",
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
