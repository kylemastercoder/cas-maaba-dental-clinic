/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction, UserWithRoles } from "./cell-action";
import { ArrowUpDown } from "lucide-react";
import { User } from "@prisma/client";
import Link from "next/link";
import { useParams } from "next/navigation";

export type PatientColumn = {
  id: string;
  name: string;
  address: string;
  email: string;
  isActive: boolean;
  sex: string;
  age: any;
  contactNumber: string;
  createdAt: string;
};

export const getColumns = (user: UserWithRoles): ColumnDef<PatientColumn>[] => {
  const columns: ColumnDef<PatientColumn>[] = [
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
      cell: ({ row }) => {
        const params = useParams();
        return (
          <Link
            href={`/${params.branchId}/patients/${row.original.id}/treatment-plan`}
            className="text-black dark:text-white hover:underline"
          >
            {row.original.name}
          </Link>
        );
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Address
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
    },
    {
      accessorKey: "sex",
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sex
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
    },
    {
      accessorKey: "age",
      header: ({ column }) => {
        return (
          <span
            className="flex items-center cursor-pointer"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Age
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </span>
        );
      },
    },
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
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
  ];

  // Add 'Actions' column based on the user role
  if (user?.role.name === "Dentist" || user?.role.name === "Branch Head" || user?.role.name === "Front Desk") {
    columns.push({
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return <CellAction user={user} data={row.original} />;
      },
    });
  }

  return columns;
};
