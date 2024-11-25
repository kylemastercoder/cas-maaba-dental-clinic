"use client";

import React from "react";
import jsPDF from "jspdf";
import {
  MedicalHistory,
  Patient,
  PresentHistoryIllness,
  TreatmentPlan,
} from "@prisma/client";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PatientWithTreatment extends Patient {
  treatmentPlan: TreatmentPlan[];
}

const HandlePrint = ({
  patient,
  medicalHistory,
  presentHistoryIllness,
}: {
  patient: PatientWithTreatment | null;
  medicalHistory: MedicalHistory | null;
  presentHistoryIllness: PresentHistoryIllness | null;
}) => {
  const handlePrint = () => {
    const doc = new jsPDF("portrait", "mm", "a4");

    doc.addImage('/images/logo-icon.png', 'PNG', 10, 10, 10, 10);
    // Header Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CAS-MAABA DENTAL", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Healthier Smile for a Healthier You!", 105, 27, {
      align: "center",
    });
    doc.setFontSize(10);
    doc.text("Tel: 0977 792 1892 | (046) 894 9661", 105, 33, {
      align: "center",
    });

    // Patient Information Section
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text("Patient Information", 10, 45);
    doc.line(10, 46, 200, 46); // underline

    doc.text(`Surname: ${patient?.lastName || "N/A"}`, 10, 55);
    doc.text(`Given Name: ${patient?.firstName || "N/A"}`, 10, 63);
    doc.text(`Middle Name: ${patient?.middleName || "N/A"}`, 10, 71);
    doc.text(`Age: ${patient?.age || "N/A"}`, 10, 79);
    doc.text(`Sex: ${patient?.sex || "N/A"}`, 10, 87);
    doc.text(`Address: ${patient?.address || "N/A"}`, 10, 95);

    // Medical History Section
    doc.text("Medical History", 10, 105);
    doc.line(10, 106, 200, 106);

    const history =
      medicalHistory?.allergies || "No medical history available.";
    doc.text(`Allergies: ${history}`, 10, 115);
    doc.text(
      "Developmental Abnormalities: " +
        (medicalHistory?.developmentalAbnormalities || "N/A"),
      10,
      123
    );

    // Present History of Illness Section
    doc.text("Present History of Illness", 10, 133);
    doc.line(10, 134, 200, 134);

    const illnessDetails =
      presentHistoryIllness?.name || "No present history of illness.";
    doc.text(`Details: ${illnessDetails}`, 10, 143);

    // Signature Section
    doc.line(10, 160, 80, 160); // signature line
    doc.text("Signature over Printed Name", 10, 165);

    doc.line(120, 160, 190, 160); // relation signature line
    doc.text("Relation to Patient", 120, 165);

    // Save the PDF
    doc.save(
      `${
        patient?.lastName + "_" + patient?.firstName || "Patient"
      }_Dental_Record.pdf`
    );
  };
  return (
    <div>
      <Button onClick={handlePrint}>
        <Printer className="mr-2 w-4 h-4" />
        Download PDF File
      </Button>
    </div>
  );
};

export default HandlePrint;
