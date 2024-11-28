/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { TreatmentPlanSchema } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { Role, User } from "@prisma/client";
import { useParams } from "next/navigation";
import { useSaveTreatmentPlan } from "@/data/treatment-plan";
import { toast } from "sonner";

interface UserWithRole extends User {
  role: Role;
}

const TreatmentModal = ({
  initialData,
  toothNumber,
  onClose,
  isOpen,
  user,
}: {
  initialData?: any;
  onClose: () => void;
  isOpen: boolean;
  toothNumber: number | null;
  user?: UserWithRole;
}) => {
  const params = useParams();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(
    null
  );
  const title = initialData ? "Edit Dental Remarks" : "Add Dental Remarks";
  const description = initialData
    ? "Make sure to click save changes after you update the dental remarks."
    : "Please fill the required fields to add a new dental remarks.";
  const action = initialData ? "Save Changes" : "Save Dental Remarks";
  const form = useForm<z.infer<typeof TreatmentPlanSchema>>({
    resolver: zodResolver(TreatmentPlanSchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          toothNumber: toothNumber,
        }
      : {
          toothNumber: toothNumber,
          diagnosis: "",
          otherDiagnosis: "",
          remarks: "",
        },
  });

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      toothNumber: toothNumber ?? 0,
    });
  }, [form, toothNumber]);

  useEffect(() => {
    const subscription = form.watch((values) => {
      setSelectedDiagnosis(values.diagnosis ?? null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const { mutate: saveTreatmentPlan, isPending: isSaving } =
    useSaveTreatmentPlan(params?.patientId as string);

  async function onSubmit(values: z.infer<typeof TreatmentPlanSchema>) {
    if (values.diagnosis === "Others") {
      values.diagnosis = values.otherDiagnosis ?? "";
    }
    delete values.otherDiagnosis;
    saveTreatmentPlan(values, {
      onSuccess: (data) => {
        if (data.success) {
          onClose();
          window.location.reload();
        } else {
          toast.error(data.error);
        }
      },
    });
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
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
                  label="Tooth Number"
                  isRequired={true}
                  name="toothNumber"
                  disabled
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  label="Diagnosis"
                  selectOptions={[
                    { label: "Decal", value: "Decal" },
                    { label: "Caries", value: "Caries" },
                    { label: "Recurrent", value: "Recurrent" },
                    { label: "For EXO", value: "For EXO" },
                    {
                      label: "Abraided/Attrition",
                      value: "Abraided/Attrition",
                    },
                    {
                      label: "Incipient",
                      value: "Incipient",
                    },
                    {
                      label: "Impacted",
                      value: "Impacted",
                    },
                    { label: "Severe", value: "Severe" },
                    { label: "CO or AM", value: "CO or AM" },
                    { label: "Erupting", value: "Erupting" },
                    { label: "Extracted", value: "Extracted" },
                    { label: "Sealant", value: "Sealant" },
                    { label: "Others", value: "Others" },
                  ]}
                  placeholder="Select diagnosis"
                  isRequired={true}
                  name="diagnosis"
                  disabled={isSaving}
                />
                {selectedDiagnosis === "Others" && (
                  <CustomFormField
                    control={form.control}
                    fieldType={FormFieldType.INPUT}
                    label="Other Diagnosis"
                    placeholder="Enter specific diagnosis"
                    isRequired={false}
                    name="otherDiagnosis"
                    disabled={isSaving}
                  />
                )}
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.TEXTAREA}
                  label="Dental Remarks"
                  placeholder="Enter dental remarks"
                  isRequired={false}
                  name="remarks"
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

export default TreatmentModal;
