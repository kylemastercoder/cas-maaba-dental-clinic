/* eslint-disable jsx-a11y/alt-text */
import db from "@/lib/db";
import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
  renderToStream,
} from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { PatientWithTreatment } from "../client";
import {
  MedicalHistory,
  PresentHistoryIllness,
  Service,
  User,
} from "@prisma/client";
import { format } from "date-fns";

const styles = StyleSheet.create({
  logo: {
    width: 100, // Set the size of your logo
    height: 80,
  },
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
    padding: 20,
    height: "100%",
  },
  flexCol: {
    flexDirection: "column",
    gap: 3,
  },
  flexRow: {
    flexDirection: "row",
    gap: 2,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flexRowCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    marginBottom: 20,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  header: {
    fontSize: 21,
    marginBottom: 5,
    fontWeight: "bold",
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: "normal",
    color: "#333",
  },
  card: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 10,
    width: "100%",
    border: "1px solid #ccc",
  },
  props: {
    fontWeight: "bold",
    fontSize: 11,
  },
  value: {
    fontSize: 11,
  },
  table: {
    width: "100%",
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 2,
    borderBottomColor: "#aaa",
  },
  tableCell: {
    flex: 1, // Ensures each cell takes up equal space unless overridden
    padding: 5,
    fontSize: 10, // Make text more legible
    textAlign: "center",
    borderRightWidth: 1,
    borderRightColor: "#ccc",
  },
  lastCell: {
    borderRightWidth: 0, // Remove the right border for the last cell
  },
  headerCell: {
    fontWeight: "bold",
    fontSize: 10,
    textAlign: "center",
  },
  tooth: {
    width: 50,
    height: 50,
  },
});

interface PatientDocumentProps {
  patient: PatientWithTreatment;
  medicalHistory: MedicalHistory;
  presentHistoryIllness: PresentHistoryIllness;
  dentists: User[];
  services: Service[];
}

const PatientDocument: React.FC<PatientDocumentProps> = ({
  patient,
  dentists,
  medicalHistory,
  presentHistoryIllness,
  services,
}) => {
  const dentistIds = patient.treatmentPlan.map((item) => item.dentistId); // Extract all dentist IDs from the treatment plan
  const dentist = dentists.find((d) => dentistIds.includes(d.id))?.name ?? "";
  const serviceIds = patient.treatmentPlan.map((item) => item.serviceId); // Extract all service IDs from the treatment plan
  const service = services.find((s) => serviceIds.includes(s.id))?.name ?? "";
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.flexCol}>
          <View style={styles.flexRowCenter}>
            <Image
              style={styles.logo}
              src="https://firebasestorage.googleapis.com/v0/b/tander-mobile.appspot.com/o/logo-icon.png?alt=media&token=7d43f8b7-452d-4a30-bc07-2092160647be"
            />
            <Text style={styles.header}>Cas-Maaba Dental Clinic</Text>
          </View>
          <View style={styles.flexCol}>
            <Text style={styles.header}>Patient Dental Record</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.subHeader}>Personal Information</Text>
            <View style={styles.flexCol}>
              <View style={styles.flexRow}>
                <Text style={styles.props}>Name: </Text>
                <Text style={styles.value}>
                  {patient.firstName} {patient.lastName}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>Residential Address: </Text>
                <Text style={styles.value}>{patient.address}</Text>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Birthday: </Text>
                  <Text style={styles.value}>
                    {patient?.birthdate
                      ? format(new Date(patient.birthdate), "MMMM dd, yyyy")
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Marital Status: </Text>
                  <Text style={styles.value}>{patient.maritalStatus}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Age: </Text>
                  <Text style={styles.value}>{patient.age}</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Sex: </Text>
                  <Text style={styles.value}>{patient.sex}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Contact Number: </Text>
                  <Text style={styles.value}>{patient.contactNumber}</Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Birthplace (Hospital): </Text>
                  <Text style={styles.value}>{patient.birthPlace}</Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Facebook Name: </Text>
                  <Text style={styles.value}>
                    {patient.facebookName || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Occupation: </Text>
                  <Text style={styles.value}>
                    {patient.occupation || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Weight (kg): </Text>
                  <Text style={styles.value}>
                    {patient.weight + " kg" || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Height (cm): </Text>
                  <Text style={styles.value}>
                    {patient.height + " cm" || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Father&apos;s Name: </Text>
                  <Text style={styles.value}>
                    {patient.fatherName || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Father&apos;s Occupation: </Text>
                  <Text style={styles.value}>
                    {patient.fatherOccupation || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>
                    Father&apos;s Contact Number:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {patient.fatherContactNumber || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Mother&apos;s Name: </Text>
                  <Text style={styles.value}>
                    {patient.motherName || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Mother&apos;s Occupation: </Text>
                  <Text style={styles.value}>
                    {patient.motherOccupation || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>
                    Mother&apos;s Contact Number:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {patient.motherContactNumber || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Guardian&apos;s Name: </Text>
                  <Text style={styles.value}>
                    {patient.guardianName || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Guardian&apos;s Relation: </Text>
                  <Text style={styles.value}>
                    {patient.guardianRelation || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>
                    Guardian&apos;s Contact Number:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {patient.guardianContactNumber || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.gridRow}>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>Doctor&apos;s Name: </Text>
                  <Text style={styles.value}>
                    {patient.doctorName || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>
                    Doctor&apos;s Specialization:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {patient.doctorSpecialization || "N/A"}
                  </Text>
                </View>
                <View style={styles.flexRow}>
                  <Text style={styles.props}>
                    Doctor&apos;s Contact Number:{" "}
                  </Text>
                  <Text style={styles.value}>
                    {patient.doctorContactNumber || "N/A"}
                  </Text>
                </View>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>Referred by: </Text>
                <Text style={styles.value}>{patient.referredBy || "N/A"}</Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>Reason for Consultation: </Text>
                <Text style={styles.value}>
                  {patient.consultationReason || "N/A"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.subHeader}>History of Present Illness</Text>
            <Text style={styles.value}>{presentHistoryIllness.name}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.subHeader}>Medical History</Text>
            <View style={styles.flexCol}>
              <View style={styles.flexRow}>
                <Text style={styles.props}>Current Medication/Vitamins: </Text>
                <Text style={styles.value}>
                  {medicalHistory.currentMedication || "N/A"}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>Previous Hospitalization: </Text>
                <Text style={styles.value}>
                  {medicalHistory.previousHospitalization || "N/A"}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>Allergies (Medicine/Food): </Text>
                <Text style={styles.value}>
                  {medicalHistory.allergies || "N/A"}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>Developmental Abnormalities: </Text>
                <Text style={styles.value}>
                  {medicalHistory.developmentalAbnormalities || "N/A"}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>Any history of the following: </Text>
                <Text style={styles.value}>
                  {medicalHistory?.histories?.length > 0
                    ? medicalHistory.histories.join(", ")
                    : "N/A"}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>
                  Have you experienced any unfavorable reaction from any
                  previous dental care or medical care?:{" "}
                </Text>
                <Text style={styles.value}>
                  {medicalHistory.medicalCareReaction || "N/A"}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>If yes, please specify: </Text>
                <Text style={styles.value}>
                  {medicalHistory.yesSpecify || "N/A"}
                </Text>
              </View>
              <View style={styles.flexRow}>
                <Text style={styles.props}>
                  Social and Family Medical History:{" "}
                </Text>
                <Text style={styles.value}>
                  {medicalHistory.socialFamilyHistory || "N/A"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.subHeader}>Dental Remarks</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={[styles.tableRow, styles.tableHeader]}>
                <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
                <Text style={[styles.tableCell, styles.headerCell]}>
                  Tooth Number
                </Text>
                <Text style={[styles.tableCell, styles.headerCell]}>
                  Diagnosis
                </Text>
                <Text style={[styles.tableCell, styles.headerCell]}>
                  Notes/Remarks
                </Text>
              </View>
              {/* Table Body */}
              {patient.dentalRemarks.map((treatment, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.tableCell}>
                    {treatment.createdAt
                      ? format(new Date(treatment.createdAt), "MMMM dd, yyyy")
                      : "N/A"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {treatment.toothNumber || "N/A"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {treatment.diagnosis || "N/A"}
                  </Text>
                  <Text style={styles.tableCell}>
                    {treatment.dentalRemarks || "N/A"}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Page>
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.subHeader}>Dental History</Text>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={[styles.tableCell, styles.headerCell]}>Date</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Tooth Number
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Treatment Rendered
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>
                Notes/Remarks
              </Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Dentist</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>Amount</Text>
              <Text style={[styles.tableCell, styles.headerCell]}>MOP</Text>
              <Text
                style={[styles.tableCell, styles.headerCell, styles.lastCell]}
              >
                Status
              </Text>
            </View>
            {/* Table Body */}
            {patient.treatmentPlan.map((treatment, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>
                  {treatment.createdAt
                    ? format(new Date(treatment.createdAt), "MMMM dd, yyyy")
                    : "N/A"}
                </Text>
                <Text style={styles.tableCell}>
                  {treatment.toothNumber || "N/A"}
                </Text>
                <Text style={styles.tableCell}>{service || "N/A"}</Text>
                <Text style={styles.tableCell}>
                  {treatment.dentalRemarks || "N/A"}
                </Text>
                <Text style={styles.tableCell}>{dentist || "N/A"}</Text>
                <Text style={styles.tableCell}>
                  {treatment.amount || "N/A"}
                </Text>
                <Text style={styles.tableCell}>
                  {treatment.paymentMethod || "N/A"}
                </Text>
                <Text style={[styles.tableCell, styles.lastCell]}>
                  {treatment.status || "N/A"}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export async function GET(
  request: Request,
  { params }: { params: { patientId: string } }
) {
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

  const users = await db.user.findMany({
    where: {
      role: {
        name: "Dentist",
      },
    },
  });

  const services = await db.service.findMany();

  if (!patient || !medicalHistory || !presentHistoryIllness) {
    return new NextResponse("Data not found", { status: 404 });
  }

  const stream = await renderToStream(
    <PatientDocument
      patient={patient}
      medicalHistory={medicalHistory}
      presentHistoryIllness={presentHistoryIllness}
      dentists={users}
      services={services}
    />
  );

  return new NextResponse(stream as unknown as ReadableStream);
}
