/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { DentalHistorySchema } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Modal } from "../ui/modal";
import { useParams } from "next/navigation";
import { useSaveDentalHistory } from "@/data/treatment-plan";
import { TreatmentColumn } from "@/app/(dashboard)/[branchId]/(views)/patients/[patientId]/treatment-plan/column";
import { Service, User } from "@prisma/client";
import { getAllDentists } from "@/actions/user";
import { getAllServices } from "@/actions/service";

const UpdateDentalHistoryModal = ({
  initialData,
  onClose,
  isOpen,
}: {
  initialData?: TreatmentColumn;
  onClose: () => void;
  isOpen: boolean;
}) => {
  const params = useParams();
  const [dentists, setDentists] = React.useState<User[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const title = initialData ? "Edit Treatment Plan" : "Add Treatment Plan";
  const description = initialData
    ? "Make sure to click save changes after you update the treatment plan."
    : "Please fill the required fields to add a new treatment plan.";
  const action = initialData ? "Save Changes" : "Save Treatment Plan";
  const form = useForm<z.infer<typeof DentalHistorySchema>>({
    resolver: zodResolver(DentalHistorySchema),
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          toothNumber: initialData.toothNumber,
          service: initialData.serviceId,
          dentist: initialData.dentistId,
          status: initialData.status,
          paymentMethod: initialData.paymentMethod || "",
        }
      : {
          toothNumber: 1,
          service: "",
          remarks: "",
          dentist: "",
          paymentMethod: "",
          status: "",
          amount: "",
        },
  });

  React.useEffect(() => {
    const fetchDoctors = async () => {
      const response = await getAllDentists();
      setDentists(response.data ?? []);
    };
    fetchDoctors();
  }, []);

  React.useEffect(() => {
    const fetchServices = async () => {
      const response = await getAllServices();
      setServices(response.data ?? []);
    };
    fetchServices();
  }, []);

  const { mutate: saveDentalHistory, isPending: isSaving } =
    useSaveDentalHistory(params?.patientId as string, initialData);

  async function onSubmit(values: z.infer<typeof DentalHistorySchema>) {
    saveDentalHistory(values, {
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
                  label="Dentist"
                  placeholder="Select dentist name"
                  selectOptions={dentists.map((dentist) => ({
                    label: dentist.name,
                    value: dentist.id,
                  }))}
                  isRequired={true}
                  name="dentist"
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
                  disabled
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.TEXTAREA}
                  label="Dental Remarks"
                  placeholder="Enter dental remarks"
                  isRequired={false}
                  name="remarks"
                  disabled
                />
                <CustomFormField
                  control={form.control}
                  fieldType={FormFieldType.INPUT}
                  label="Amount"
                  placeholder="Enter amount"
                  isRequired={true}
                  name="amount"
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

export default UpdateDentalHistoryModal;
