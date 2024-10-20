/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createPatient,
  deletePatient,
  getAllPatients,
  updatePatient,
} from "@/actions/patient";
import { PatientSchema } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useGetPatients() {
  return useQuery({
    queryFn: async () => getAllPatients(),
    queryKey: ["patients"],
  });
}

export function useSavePatient(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof PatientSchema>) => {
      if (initialData) {
        return updatePatient(values, initialData.id);
      } else {
        return createPatient(values);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["patients"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useDeletePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patientId: string) => {
      return deletePatient(patientId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["patients"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
