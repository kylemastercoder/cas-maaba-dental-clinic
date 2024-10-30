import { Heading } from "@/components/ui/heading";
import db from "@/lib/db";
import React from "react";
import TreatmentClient from "./client";

const TreatmentPlan = async ({ params }: { params: { patientId: string } }) => {
  const patient = await db.patient.findUnique({
    where: {
      id: params.patientId,
    },
    include: {
      treatmentPlan: true
    },
  });
  return (
    <div className="md:grid items-start gap-4 md:gap-8">
      <Heading
        title={`Treatment Plan`}
        description="A detailed overview of the patient's treatment, including personal information, medical history, dental chart, and ongoing care for improved dental health."
      />
      <TreatmentClient patient={patient} />
    </div>
  );
};

export default TreatmentPlan;
