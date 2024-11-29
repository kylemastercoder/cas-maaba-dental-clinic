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
import {
  useSaveDentalHistory,
} from "@/data/treatment-plan";

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
  user?: UserWithRole;
}) => {
  const params = useParams();
  const [dentists, setDentists] = React.useState<User[]>([]);
  const [services, setServices] = React.useState<Service[]>([]);
  const form = useForm<z.infer<typeof DentalHistorySchema>>({
    resolver: zodResolver(DentalHistorySchema),
    mode: "onChange",
    defaultValues: {
      toothNumber: "",
      service: "",
      remarks: "",
      paymentMethod: "",
      status: "",
      amount: "",
      dentist: user?.role.name === "Dentist" ? user?.id : "",
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
    useSaveDentalHistory(params?.patientId as string);

  async function onSubmit(values: z.infer<typeof DentalHistorySchema>) {
    saveDentalHistory(values, {
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
            fieldType={FormFieldType.TEXTAREA}
            label="Dental Remarks"
            placeholder="Enter dental remarks"
            isRequired={false}
            name="remarks"
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
