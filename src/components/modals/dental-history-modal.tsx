import React from "react";
import { Modal } from "../ui/modal";
import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DentalHistorySchema } from "@/lib/validators";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { getAllDentists } from "@/actions/user";
import { Role, Service, User } from "@prisma/client";
import { getAllServices } from "@/actions/service";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "next/navigation";
import { useSaveTreatmentPlan } from "@/data/treatment-plan";

interface UserWithRole extends User {
  role: Role;
}

const DentalHistoryModal = ({
  isOpen,
  onClose,
  user,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserWithRole;
}) => {
  const params = useParams();
  const [dentists, setDentists] = React.useState<User[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState<
    string | null
  >(null);
  const form = useForm<z.infer<typeof DentalHistorySchema>>({
    resolver: zodResolver(DentalHistorySchema),
    mode: "onChange",
    defaultValues: {
      toothNumber: 1,
      service: "",
      diagnosis: "",
      remarks: "",
      isPaid: true,
      paymentMethod: "",
      otherDiagnosis: "",
      status: "",
      amount: "",
      dentist: user.role.name === "Dentist" ? user.id : "",
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

  React.useEffect(() => {
    const subscription = form.watch((values) => {
      setSelectedDiagnosis(values.diagnosis ?? null);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const { mutate: saveTreatmentPlan, isPending: isSaving } =
    useSaveTreatmentPlan(params?.patientId as string);

  async function onSubmit(values: z.infer<typeof DentalHistorySchema>) {
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
    <Modal
      title="Add Dental History"
      description="Provide detailed dental history for the patient, including past treatments, conditions, and any relevant notes."
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <CustomFormField
            label="Tooth Number"
            type="number"
            fieldType={FormFieldType.INPUT}
            name="toothNumber"
            control={form.control}
            isRequired={true}
            disabled={isSaving}
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
            disabled={isSaving}
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
            disabled={isSaving}
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
          />
          {selectedDiagnosis === "Others" && (
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              label="Other Diagnosis"
              placeholder="Enter specific diagnosis"
              isRequired={false}
              disabled={isSaving}
              name="otherDiagnosis"
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
          <Button type="submit" size="sm">
            {isSaving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </form>
      </Form>
    </Modal>
  );
};

export default DentalHistoryModal;
