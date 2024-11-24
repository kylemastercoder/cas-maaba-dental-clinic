"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, SupplyColumn } from "./column";
import { format } from "date-fns";
import { useGetSupplies } from "@/data/supply";

const SupplyClient = () => {
  const { data: supplyData, error, isLoading } = useGetSupplies();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);


  const formattedData: SupplyColumn[] =
    supplyData?.data?.map((item) => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      category: item.category,
      unit: item.unit.name,
      unitId: item.unitId,
      used: item.used,
      stocks: item.quantity,
      branch: item.branch.name,
      remaining: (item.quantity) - item.used,
      createdAt: format(new Date(item.createdAt), "MMMM dd, yyyy"),
      branchId: item.branchId,
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <DataTable
      loading={isLoading}
      searchKey="name"
      columns={columns}
      data={formattedData}
    />
  );
};

export default SupplyClient;
