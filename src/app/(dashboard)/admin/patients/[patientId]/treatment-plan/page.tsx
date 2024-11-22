import { Heading } from "@/components/ui/heading";
import db from "@/lib/db";
import React from "react";
import TreatmentClient from "./client";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

const TreatmentPlan = async ({ params }: { params: { patientId: string } }) => {
  const patient = await db.patient.findUnique({
    where: {
      id: params.patientId,
    },
    include: {
      treatmentPlan: true,
    },
  });

  const medicalHistory = await db.medicalHistory.findFirst({
    where: {
      patientId: params.patientId,
    },
  });

  const dentists = await db.user.findMany({
    where: {
      role: {
        name: "Dentist",
      },
    },
  });
  return (
    <div className="md:grid items-start gap-4 md:gap-8">
      <div className="flex justify-between items-center">
        <Heading
          title={`Patient Dental Record`}
          description="A detailed overview of the patient's treatment, including personal information, medical history, dental chart, and ongoing care for improved dental health."
        />
        <Button>
          <Printer className="mr-2 w-4 h-4" />
          Download PDF File
        </Button>
      </div>
      <TreatmentClient dentists={dentists} medicalHistory={medicalHistory} patient={patient} />
    </div>
  );
};

export default TreatmentPlan;
