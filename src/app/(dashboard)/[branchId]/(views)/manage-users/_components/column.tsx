/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type UserColumn = {
  id: string;
  name: string;
  username: string;
  roleId: string;
  role: string;
  branchId: string;
  branch: string;
  isActive: boolean;
  createdAt: string;
};

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "branch",
    header: "Branch",
  },
  {
    accessorKey: "createdAt",
    header: "Date Created",
  },
];
