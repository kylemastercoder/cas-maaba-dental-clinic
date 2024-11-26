import { MedicalHistorySchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useSaveMedicalHistory } from "@/data/medical-history";
import { MedicalHistory } from "@prisma/client";
import { UserWithRoles } from "@/app/(dashboard)/[branchId]/(views)/patients/_components/cell-action";

const MedicalHistoryForm = ({
  patientId,
  initialData,
  user,
}: {
  patientId: string;
  initialData: MedicalHistory | null;
  user?: UserWithRoles;
}) => {
  const form = useForm<z.infer<typeof MedicalHistorySchema>>({
    resolver: zodResolver(MedicalHistorySchema),
    mode: "onChange",
    defaultValues: {
      currentMedication: initialData?.currentMedication || "",
      previousHospitalization: initialData?.previousHospitalization || "",
      allergies: initialData?.allergies || "",
      developmentalAbnormalities: initialData?.developmentalAbnormalities || "",
      histories: initialData?.histories || [],
      medicalCareReaction: initialData?.medicalCareReaction || "",
      yesSpecify: initialData?.yesSpecify || "",
      socialFamilyHistory: initialData?.socialFamilyHistory || "",
    },
  });

  const { mutate: saveMedicalHistory, isPending: isSaving } =
    useSaveMedicalHistory(patientId as string, initialData);

  async function onSubmit(values: z.infer<typeof MedicalHistorySchema>) {
    saveMedicalHistory(values, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Current Medication/Vitamins"
            placeholder="Enter N/A if not applicable"
            name="currentMedication"
            isRequired
            disabled={user?.role.name === "Front Desk" || isSaving}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Previous Hospitalization"
            placeholder="Enter N/A if not applicable"
            name="previousHospitalization"
            isRequired
            disabled={user?.role.name === "Front Desk" || isSaving}
          />
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mt-3">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Allergies (Medicine/Food)"
            placeholder="Enter N/A if not applicable"
            name="allergies"
            isRequired
            disabled={user?.role.name === "Front Desk" || isSaving}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Developmental Abnormalities"
            placeholder="Enter N/A if not applicable"
            name="developmentalAbnormalities"
            isRequired
            disabled={user?.role.name === "Front Desk" || isSaving}
          />
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <p className="font-semibold text-sm">Any history of the following:</p>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.CHECKBOX}
            label="Any history of the following:"
            disabled={user?.role.name === "Front Desk" || isSaving}
            name="histories"
            options={[
              "Circulatory Problem",
              "Rheumatic Fever",
              "Lung Problem",
              "Bleeding Disorder",
              "Glandular Problem",
              "Liver Problem",
              "Convulsion",
              "Diabetes",
              "Kidney Problem",
              "Asthma",
              "Seizures",
              "Heart Problem",
              "Others",
            ]}
            isRequired
          />
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mt-3 mb-3">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="Have you experienced any unfavorable reaction from any previous dental care or medical care?"
            placeholder="Yes or No"
            name="medicalCareReaction"
            isRequired
            disabled={user?.role.name === "Front Desk" || isSaving}
          />
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            label="If yes, please specify"
            placeholder=""
            name="yesSpecify"
            disabled={user?.role.name === "Front Desk" || isSaving}
            isRequired={false}
          />
        </div>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          label="Social and Family Medical History"
          placeholder="Enter N/A if not applicable"
          name="socialFamilyHistory"
          isRequired
          disabled={user?.role.name === "Front Desk" || isSaving}
        />
        <Button
          type="submit"
          disabled={user?.role.name === "Front Desk" || isSaving}
          className="mt-3"
        >
          {isSaving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default MedicalHistoryForm;
