/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createTreatmentPlan,
  deleteTreatmentPlan,
  getAllTreatmentPlanByPatient,
  updateTreatmentPlan,
} from "@/actions/treatment-plan";
import { TreatmentPlanSchema } from "@/lib/validators";
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
