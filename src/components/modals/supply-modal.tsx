/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { SupplySchema } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useSaveSupply } from "@/data/supply";
import { Branch } from "@prisma/client";
import { useParams } from "next/navigation";

const SupplyForm = ({
  initialData,
  onClose,
  branches,
}: {
  initialData: any;
  onClose: () => void;
  branches: Branch[];
}) => {
  const params = useParams();
  const title = initialData ? "Edit Supply" : "Add Supply";
  const description = initialData
    ? "Make sure to click save changes after you update the supply."
    : "Please fill the required fields to add a new supply.";
  const action = initialData ? "Save Changes" : "Save Supply";
  const form = useForm<z.infer<typeof SupplySchema>>({
    resolver: zodResolver(SupplySchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          branchId: initialData.branchId,
        }
      : {
          name: "",
          category: "",
          unit: "",
          stocks: 0,
          used: 0,
          branchId: Array.isArray(params.branchId)
            ? params.branchId[0]
            : params.branchId ?? "",
        },
  });

  const { mutate: saveSupply, isPending: isSaving } =
    useSaveSupply(initialData);

  async function onSubmit(values: z.infer<typeof SupplySchema>) {
    saveSupply(values, {
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
                  placeholder="Enter supply name"
                  label="Name"
                  isRequired={true}
                  name="name"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  placeholder="Enter supply category"
                  label="Category"
                  isRequired={true}
                  name="category"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  placeholder="Select supply unit"
                  label="Unit"
                  selectOptions={[
                    { label: "pcs", value: "pcs" },
                    { label: "box", value: "box" },
                    { label: "bottle", value: "bottle" },
                    { label: "sachet", value: "sachet" },
                  ]}
                  isRequired={true}
                  name="unit"
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
                <div className="grid grid-cols-2 gap-4">
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    placeholder="Enter stock"
                    label="Stock"
                    type="number"
                    isRequired={true}
                    name="stocks"
                    disabled={isSaving}
                  />
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    placeholder="Enter used"
                    label="Used"
                    isRequired={false}
                    name="used"
                    disabled={isSaving}
                  />
                </div>
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

export default SupplyForm;
