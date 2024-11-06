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
import { Service } from "@prisma/client";
import { getAllServices } from "@/actions/service";
import { useParams } from "next/navigation";
import { useSaveTreatmentPlan } from "@/data/treatment-plan";

const TreatmentModal = ({
  initialData,
  toothNumber,
  onClose,
  isOpen,
}: {
  initialData?: any;
  onClose: () => void;
  isOpen: boolean;
  toothNumber: number | null;
}) => {
  const params = useParams();
  const [services, setServices] = useState<Service[]>([]);
  const title = initialData ? "Edit Treatment Plan" : "Add Treatment Plan";
  const description = initialData
    ? "Make sure to click save changes after you update the treatment plan."
    : "Please fill the required fields to add a new treatment plan.";
  const action = initialData ? "Save Changes" : "Save Treatment Plan";
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
          service: "",
          diagnosis: "",
          remarks: "",
          isPaid: true,
          paymentMethod: "",
          status: "",
        },
  });

  useEffect(() => {
    const fetchServices = async () => {
      const response = await getAllServices();
      setServices(response.data ?? []);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    form.reset({
      ...form.getValues(),
      toothNumber: toothNumber ?? 0,
    });
  }, [form, toothNumber]);

  const { mutate: saveTreatmentPlan, isPending: isSaving } =
    useSaveTreatmentPlan(params?.patientId as string);

  async function onSubmit(values: z.infer<typeof TreatmentPlanSchema>) {
    saveTreatmentPlan(values, {
      onSuccess: () => {
        onClose();
        window.location.reload();
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
                  label="Service"
                  placeholder="Select a service"
                  isRequired={true}
                  selectOptions={services.map((service) => ({
                    label: service.name,
                    value: service.id,
                  }))}
                  name="service"
                  disabled={isSaving}
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
                  ]}
                  placeholder="Select diagnosis"
                  isRequired={true}
                  name="diagnosis"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.TEXTAREA}
                  label="Dental Remarks"
                  placeholder="Enter dental remarks"
                  isRequired={false}
                  name="remarks"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  label="Payment Method"
                  selectOptions={[
                    { label: "E-Wallet", value: "E-Wallet" },
                    { label: "Bank Transfer", value: "Bank Transfer" },
                    { label: "Credit Card", value: "Credit Card" },
                    { label: "Cash", value: "Cash" },
                    {
                      label: "HMO",
                      value: "HMO",
                    },
                  ]}
                  placeholder="Select payment method"
                  isRequired={true}
                  name="paymentMethod"
                  disabled={isSaving}
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.SELECT}
                  label="Status"
                  selectOptions={[
                    { label: "Pending", value: "Pending" },
                    { label: "Not Yet Paid", value: "Not Yet Paid" },
                    { label: "Paid", value: "Paid" },
                  ]}
                  placeholder="Select status"
                  isRequired={true}
                  name="status"
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
