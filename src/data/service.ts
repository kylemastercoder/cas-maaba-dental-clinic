/* eslint-disable @typescript-eslint/no-explicit-any */

import { createService, deleteService, getAllServices, updateService } from "@/actions/service";
import { ServiceSchema } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useGetServices() {
  return useQuery({
    queryFn: async () => getAllServices(),
    queryKey: ["services"],
  });
}

export function useSaveService(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof ServiceSchema>) => {
      if (initialData) {
        return updateService(values, initialData.id);
      } else {
        return createService(values);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["services"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceId: string) => {
      return deleteService(serviceId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["services"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
