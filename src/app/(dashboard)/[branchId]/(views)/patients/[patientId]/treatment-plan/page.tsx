import { Heading } from "@/components/ui/heading";
import db from "@/lib/db";
import React from "react";
import TreatmentClient from "./client";
import { getUserFromCookies } from "@/hooks/use-user";
import HandlePrint from "./handle-print";

const TreatmentPlan = async ({ params }: { params: { patientId: string } }) => {
  const { user } = await getUserFromCookies();
  const patient = await db.patient.findUnique({
    where: {
      id: params.patientId,
    },
    include: {
      treatmentPlan: true,
      dentalRemarks: true,
    },
  });

  const medicalHistory = await db.medicalHistory.findFirst({
    where: {
      patientId: params.patientId,
    },
  });

  const presentHistoryIllness = await db.presentHistoryIllness.findFirst({
    where: {
      patientId: params.patientId,
    },
  });
  return (
    <div className="md:grid items-start gap-4 md:gap-8">
      <div className="flex justify-between items-center">
        <Heading
          title={`Patient Dental Record`}
          description="A detailed overview of the patient's treatment, including personal information, medical history, dental chart, and ongoing care for improved dental health."
        />
        <HandlePrint />
      </div>
      {user && (
        <TreatmentClient
          presentHistoryIllness={presentHistoryIllness}
          medicalHistory={medicalHistory}
          patient={patient}
          user={user}
        />
      )}
    </div>
  );
};

export default TreatmentPlan;
