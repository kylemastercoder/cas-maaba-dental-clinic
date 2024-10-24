"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, LogsColumn } from "./column";
import { useGetLogs } from "@/data/logs";

const LogsClient = () => {
  const { data: logsData, error, isLoading } = useGetLogs();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  let idCounter = 1;
  const formattedData: LogsColumn[] =
    logsData?.data?.map((item) => ({
      id: idCounter++,
      action: item.action,
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="action"
        columns={columns}
        data={formattedData}
      />
    </>
  );
};

export default LogsClient;
