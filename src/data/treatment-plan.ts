/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createDentalHistory,
  createTreatmentPlan,
  deleteTreatmentPlan,
  getAllTreatmentPlanByPatient,
  updateDentalHistory,
  updateTreatmentPlan,
} from "@/actions/treatment-plan";
import { DentalHistorySchema, TreatmentPlanSchema } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useGetTreatmentPlan(patientId: string) {
  return useQuery({
    queryFn: async () => getAllTreatmentPlanByPatient(patientId),
    queryKey: ["treatmentPlan"],
  });
}

export function useSaveTreatmentPlan(patientId: string, initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof TreatmentPlanSchema>) => {
      if (initialData) {
        return updateTreatmentPlan(values, initialData.id);
      } else {
        return createTreatmentPlan(values, patientId);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["treatmentPlan"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeleteTreatmentPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (treatmentId: string) => {
      return deleteTreatmentPlan(treatmentId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["treatmentPlan"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useSaveDentalHistory(patientId: string, initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof DentalHistorySchema>) => {
      if (initialData) {
        return updateDentalHistory(values, initialData.id);
      } else {
        return createDentalHistory(values, patientId);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["dentalHistory"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
