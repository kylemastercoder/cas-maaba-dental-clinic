/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { ServiceSchema } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSaveService } from "@/data/service";
import { Branch } from "@prisma/client";
import { useParams } from "next/navigation";

const ServiceForm = ({
  initialData,
  onClose,
  branches,
}: {
  initialData: any;
  onClose: () => void;
  branches: Branch[];
}) => {
  const params = useParams();
  const title = initialData ? "Edit Service" : "Add Service";
  const description = initialData
    ? "Make sure to click save changes after you update the service."
    : "Please fill the required fields to add a new service.";
  const action = initialData ? "Save Changes" : "Save Service";
  const form = useForm<z.infer<typeof ServiceSchema>>({
    resolver: zodResolver(ServiceSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          branchId: initialData.branchId,
        }
      : {
          name: "",
          description: "",
          branchId: Array.isArray(params.branchId)
            ? params.branchId[0]
            : params.branchId ?? "",
        },
  });

  const { mutate: saveService, isPending: isSaving } =
    useSaveService(initialData);

  async function onSubmit(values: z.infer<typeof ServiceSchema>) {
    saveService(values, {
      onSuccess: () => onClose(),
    });
  }

  return (
    <>
      <Modal
        isOpen={true}
        onClose={onClose}
        title={title}
        description={description}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mx-auto grid flex-1 auto-rows-max gap-4">
              <div className="grid gap-4">
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="Enter service name"
                  label="Name"
                  isRequired={true}
                  name="name"
                  disabled={isSaving}
                />
                {!params.branchId && (
                  <CustomFormField
                    label="Branch"
                    name="branchId"
                    placeholder="Select your branch"
                    isRequired
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    selectOptions={branches.map((option) => ({
                      label: option.name,
                      value: option.id,
                    }))}
                    disabled={isSaving}
                  />
                )}
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.TEXTAREA}
                  placeholder="Enter service description"
                  label="Description"
                  isRequired={true}
                  name="description"
                  disabled={isSaving}
                />
                <Button type="submit" disabled={isSaving} size="sm">
                  {isSaving && <Loader className="animate-spin w-4 h-4 mr-2" />}
                  {action}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </Modal>
    </>
  );
};

export default ServiceForm;
