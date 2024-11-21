/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { ResetPasswordSchema } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useResetPassword } from "@/data/reset-password";

const ResetPasswordForm = ({
  userId,
  onClose,
  isOpen,
}: {
  userId: string;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      userId: userId || "",
      password: "",
      confirmPassword: "",
    },
    resetOptions: {
      keepDirtyValues: false,
    },
  });

  React.useEffect(() => {
    if (userId) {
      form.setValue("userId", userId);
    }
  }, [userId, form]);

  const { mutate: resetPassword, isPending: isSaving } = useResetPassword();

  async function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
    resetPassword(values, {
      onSuccess: (data) => {
        if (data.success) {
          onClose();
          window.location.reload();
        }
      },
    });
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Reset Password"
        description="Are you sure you want to reset this user's password?"
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto grid flex-1 auto-rows-max gap-4">
              <div className="grid gap-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="Enter user ID"
                  label="User ID"
                  isRequired={true}
                  name="userId"
                  disabled
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="Enter new password"
                  label="New Password"
                  isRequired={true}
                  name="password"
                  type="password"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="Enter confirm password"
                  label="Confirm Password"
                  isRequired={true}
                  name="confirmPassword"
                  type="password"
                  disabled={isSaving}
                />
                <Button type="submit" disabled={isSaving} size="sm">
                  {isSaving && <Loader className="animate-spin w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default ResetPasswordForm;
