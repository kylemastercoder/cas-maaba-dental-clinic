"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, ServiceColumn } from "./column";
import { format } from "date-fns";
import { useGetServices } from "@/data/service";

const ServiceClient = () => {
  const { data: serviceData, error, isLoading } = useGetServices();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: ServiceColumn[] =
    serviceData?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="name"
        columns={columns}
        data={formattedData}
      />
    </>
  );
};

export default ServiceClient;
