/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUser,
  getAllUsers,
  setActiveUser,
  setInactiveUser,
  updateUser,
} from "@/actions/user";
import { UserRegistrationSchema } from "@/lib/validators";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useGetUsers() {
  return useQuery({
    queryFn: async () => getAllUsers(),
    queryKey: ["users"],
  });
}

export function useSaveUser(initialData?: any) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof UserRegistrationSchema>) => {
      if (initialData) {
        return updateUser(values, initialData.id);
      } else {
        return createUser(values);
      }
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      } else {
        toast.error("Username already exists");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useInactiveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return setInactiveUser(userId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}

export function useActiveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return setActiveUser(userId);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
