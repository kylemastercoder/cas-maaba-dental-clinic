"use client";

import React, { useState } from "react";
import { Modal } from "../ui/modal";
import { useBranchModal } from "@/hooks/use-branch-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { BranchSchema } from "@/lib/validators";
import { Form } from "../ui/form";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { createBranch } from "@/actions/branch";
import { toast } from "sonner";

const BranchModal = () => {
  const branchModal = useBranchModal();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof BranchSchema>>({
    resolver: zodResolver(BranchSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      address: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof BranchSchema>) => {
    setIsLoading(true);
    await createBranch(values)
      .then((response) => {
        if (response.error) {
          toast.error(response.error);
        } else {
          toast.success(response.success);
          window.location.reload();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal
      title="Create branch"
      description="Add a new branch to manage patients and appointments"
      isOpen={branchModal.isOpen}
      onClose={branchModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <CustomFormField
                control={form.control}
                name="name"
                label="Branch Name"
                disabled={isLoading}
                placeholder="Enter branch name"
                isRequired
                fieldType={FormFieldType.INPUT}
              />
              <CustomFormField
                control={form.control}
                name="address"
                label="Branch Address"
                disabled={isLoading}
                placeholder="Enter branch address"
                isRequired
                fieldType={FormFieldType.INPUT}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  disabled={isLoading}
                  variant="outline"
                  onClick={branchModal.onClose}
                >
                  Cancel
                </Button>
                <Button disabled={isLoading} type="submit">
                  {isLoading && (
                    <Loader2 size={20} className="animate-spin mr-2" />
                  )}
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default BranchModal;
