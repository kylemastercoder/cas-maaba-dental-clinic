/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSupply, deleteSupply, getAllSupplies, updateSupply } from "@/actions/supply";
import { SupplySchema } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useGetSupplies() {
  return useQuery({
    queryFn: async () => getAllSupplies(),
    queryKey: ["supplies"],
  });
}

export function useSaveSupply(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof SupplySchema>) => {
      if (initialData) {
        return updateSupply(values, initialData.id);
      } else {
        return createSupply(values);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["supplies"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeleteSupply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (supplyId: string) => {
      return deleteSupply(supplyId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["supplies"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
