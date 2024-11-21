"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { columns, SupplyColumn } from "./column";
import { format } from "date-fns";
import { useGetSupplies } from "@/data/supply";
import { updateStock } from "@/actions/supply";

const SupplyClient = () => {
  const { data: supplyData, error, isLoading } = useGetSupplies();
  const [isMounted, setIsMounted] = useState(false);
  const [stocks, setStocks] = useState<Record<string, number>>({}); // Stock management state
  const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set()); // Track pending stock updates

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  useEffect(() => {
    if (supplyData) {
      // Initialize stocks based on fetched data
      const initialStocks: Record<string, number> = {};
      supplyData?.data?.forEach((item) => {
        initialStocks[item.id] = item.quantity;
      });
      setStocks(initialStocks);
    }
  }, [supplyData]);

  const handleStockChange = useCallback(
    async (id: string, change: number) => {
      if (pendingUpdates.has(id)) return; // Prevent multiple updates for the same item concurrently

      // Optimistic update: update stock locally first
      setStocks((prevStocks) => ({
        ...prevStocks,
        [id]: Math.max(0, (prevStocks[id] || 0) + change),
      }));

      // Mark the item as pending update
      setPendingUpdates((prev) => new Set(prev.add(id)));

      try {
        // Call backend API to update stock in the database
        const response = await updateStock(id, change);
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success(response.success);
        }
      } catch (error) {
        // Revert stock update on failure
        setStocks((prevStocks) => ({
          ...prevStocks,
          [id]: Math.max(0, (prevStocks[id] || 0) - change), // Revert the stock change
        }));

        if (error instanceof Error) {
          toast.error(
            error.message || "An error occurred while updating stock"
          );
        } else {
          toast.error("An error occurred while updating stock");
        }
      } finally {
        // Remove the item from the pending updates set
        setPendingUpdates((prev) => {
          const newPendingUpdates = new Set(prev);
          newPendingUpdates.delete(id);
          return newPendingUpdates;
        });
      }
    },
    [pendingUpdates]
  );

  const formattedData: SupplyColumn[] =
    supplyData?.data?.map((item) => ({
      id: item.id,
      sku: item.sku,
      name: item.name,
      category: item.category,
      unit: item.unit.name,
      unitId: item.unitId,
      used: item.used,
      stocks: stocks[item.id] || item.quantity, // Use updated stocks state
      branch: item.branch.name,
      remaining: (stocks[item.id] || item.quantity) - item.used,
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
      columns={columns(handleStockChange)}
      data={formattedData}
    />
  );
};

export default SupplyClient;
