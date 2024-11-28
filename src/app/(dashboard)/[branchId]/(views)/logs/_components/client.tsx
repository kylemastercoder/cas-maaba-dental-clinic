"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, LogsColumn } from "./column";
import { useGetLogsByUser } from "@/data/logs";
import { useParams } from "next/navigation";

const LogsClient = () => {
  const { data: logsData, error, isLoading } = useGetLogsByUser();
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const branchId = params.branchId;

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
    logsData?.data
      ?.filter((item) => (branchId ? item.branchId === branchId : true))
      .map((item) => ({
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
