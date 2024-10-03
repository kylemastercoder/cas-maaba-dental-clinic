import React from "react";
import db from "@/lib/db";
import PatientForm from "@/components/forms/patient-form";

const PatientPage = async ({ params }: { params: { patientId: string } }) => {
  const patient = await db.patient.findUnique({
    where: {
      id: params.patientId,
    },
  });

  return (
    <div className="flex-1 space-y-4">
      <PatientForm initialData={patient} />
    </div>
  );
};

export default PatientPage;
