import { PresentIllnessSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../ui/form";
import CustomFormField from "../globals/custom-formfield";
import { FormFieldType } from "@/constants";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { useSavePresentIllness } from "@/data/medical-history";
import { PresentHistoryIllness } from "@prisma/client";
import { UserWithRoles } from "@/app/(dashboard)/[branchId]/(views)/patients/_components/cell-action";

const PresentHistoryIllnessForm = ({
  patientId,
  initialData,
  user,
}: {
  patientId: string;
  initialData: PresentHistoryIllness | null;
  user: UserWithRoles;
}) => {
  const form = useForm<z.infer<typeof PresentIllnessSchema>>({
    resolver: zodResolver(PresentIllnessSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
    },
  });

  const { mutate: savePresentIllness, isPending: isSaving } =
    useSavePresentIllness(patientId as string, initialData);

  async function onSubmit(values: z.infer<typeof PresentIllnessSchema>) {
    savePresentIllness(values, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.TEXTAREA}
          label="Type here..."
          placeholder="Enter N/A if not applicable"
          name="name"
          isRequired
          disabled={user.role.name === "Front Desk" || isSaving}
        />
        <Button type="submit" disabled={user.role.name === "Front Desk" || isSaving} className="mt-3">
          {isSaving && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
};

export default PresentHistoryIllnessForm;
