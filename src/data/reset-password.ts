/* eslint-disable @typescript-eslint/no-explicit-any */

import { resetPassword } from "@/actions/reset-password";
import { ResetPasswordSchema } from "@/lib/validators";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export function useResetPassword() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values: z.infer<typeof ResetPasswordSchema>) => {
      return resetPassword(values);
    },
    onSuccess: (data) => {
      if (data?.success) {
        toast.success(data.success);
        queryClient.invalidateQueries({ queryKey: ["resetPassword"] });
      } else {
        toast.error(data?.error || "An error occurred");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "An error occurred");
    },
  });
}
