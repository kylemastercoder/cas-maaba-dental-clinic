/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { ColumnDef } from "@tanstack/react-table";

export type LogsColumn = {
  id: number;
  action: string;
};

export const columns: ColumnDef<LogsColumn>[] = [
  {
    accessorKey: "id",
    header: "#",
  },
  {
    accessorKey: "action",
    header: "Action",
  },
];
