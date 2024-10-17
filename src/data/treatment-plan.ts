/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTreatmentPlan, getAllTreatmentPlanByPatient } from "@/actions/treatment-plan";
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
  
  export function useSaveTreatmentPlan(patientId: string) {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: async (values: z.infer<typeof TreatmentPlanSchema>) => {
        return createTreatmentPlan(values, patientId);
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