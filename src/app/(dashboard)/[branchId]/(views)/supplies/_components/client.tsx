"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, SupplyColumn } from "./column";
import { format } from "date-fns";
import { useGetSupplies } from "@/data/supply";
import { useParams } from "next/navigation";

const SupplyClient = () => {
  const { data: supplyData, error, isLoading } = useGetSupplies();
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

  const formattedData: SupplyColumn[] =
    supplyData?.data?.filter((item) => (branchId ? item.branchId === branchId : true))
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      unit: item.unit.name,
      used: item.used,
      unitId: item.unitId,
      stocks: item.quantity,
      remaining: item.quantity - item.used,
      createdAt: format(item.createdAt, "MMMM dd, yyyy"),
      branchId: item.branchId,
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

export default SupplyClient;
