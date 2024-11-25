/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMedicalHistory, createPresentIllness } from "@/actions/medical-history";
import { MedicalHistorySchema, PresentIllnessSchema } from "@/lib/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useSaveMedicalHistory(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof MedicalHistorySchema>) => {
      return createMedicalHistory(values, patientId);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["medicalHistory"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useSavePresentIllness(patientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof PresentIllnessSchema>) => {
      return createPresentIllness(values, patientId);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["presentIllness"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
