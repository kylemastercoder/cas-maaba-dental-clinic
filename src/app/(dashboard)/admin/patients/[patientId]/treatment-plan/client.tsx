"use client";

import TreatmentModal from "@/components/modals/treatment-modal";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import {
  LOWER_MIDDLE_TEETH,
  LOWER_TEETH,
  UPPER_MIDDLE_TEETH,
  UPPER_TEETH,
} from "@/constants";
import {
  DentalRemarks,
  MedicalHistory,
  Patient,
  PresentHistoryIllness,
  Service,
  TreatmentPlan,
  User,
} from "@prisma/client";
import { format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { columns, columns2, TreatmentColumn, TreatmentColumn2 } from "./column";
import { getAllServices } from "@/actions/service";
import { useTheme } from "next-themes";
import MedicalHistoryForm from "@/components/forms/medical-history-form";
import { getAllDentists } from "@/actions/user";
import PresentHistoryIllnessForm from "@/components/forms/present-history-illness-form";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import DentalHistoryModal from "@/components/modals/dental-history-modal";

export interface PatientWithTreatment extends Patient {
  treatmentPlan: TreatmentPlan[];
  dentalRemarks: DentalRemarks[];
}

const TreatmentClient = ({
  patient,
  medicalHistory,
  presentHistoryIllness,
}: {
  patient: PatientWithTreatment | null;
  medicalHistory: MedicalHistory | null;
  presentHistoryIllness: PresentHistoryIllness | null;
}) => {
  const { theme } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const [dentists, setDentists] = useState<User[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const fullName = `${patient?.firstName} ${patient?.middleName} ${patient?.lastName}`;
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    toothNumber: string | null;
  }>({ isOpen: false, toothNumber: null });

  const openModal = (toothNumber: string) => {
    setModalData({ isOpen: true, toothNumber });
  };

  const getToothStatus = (toothNumber: string) => {
    const dentalRemarks = patient?.dentalRemarks.find(
      (t) => t.toothNumber === toothNumber && t.patientId === patient.id
    );

    if (dentalRemarks) {
      switch (dentalRemarks.diagnosis) {
        case "Decal":
          return "size-3 border-2 border-red-600"; // Decal status
        case "Caries":
          return "size-3 rounded-full bg-red-600"; // Caries status
        case "Recurrent":
          return "size-3 rounded-full border-2 border-black"; // Recurrent status
        case "For EXO":
          return "bg-red-600 w-[2px] h-6 rotate-45"; // For EXO status
        case "Abraided/Attrition":
          return "text-red-600 abraided"; // Abraided/Attrition status
        case "Severe":
          return "w-3 h-2 bg-red-500 rotate-12"; // Severe status
        case "Impacted":
          return "text-red-600 impacted"; // Impacted status
        case "Incipient":
          return "bg-red-600 w-4 h-[2px]"; // Incipient status
        case "CO or AM":
          return "size-3 rounded-full bg-black"; // CO or AM status
        case "Erupting":
          return "arrow-up";
        case "Extracted":
          return "bg-black w-[2px] h-6 rotate-45";
        case "Sealant":
          return "text-black sealant font-bold text-lg";
        case "Others":
          return "text-red-500 others font-bold text-lg";
        default:
          return "text-red-500 others font-bold text-lg";
      }
    }
    return "";
  };

  useEffect(() => {
    const fetchServices = async () => {
      const response = await getAllServices();
      setServices(response.data ?? []);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchDentists = async () => {
      const response = await getAllDentists();
      setDentists(response.data ?? []);
    };
    fetchDentists();
  }, []);

  const formattedData: TreatmentColumn[] =
    patient?.treatmentPlan?.map((item) => {
      const service = services.find((s) => s.id === item.serviceId)?.name ?? "";
      const dentist = dentists.find((d) => d.id === item.dentistId)?.name ?? "";
      return {
        id: item.id,
        service: service,
        serviceId: item.serviceId ?? "",
        dentistId: item.dentistId,
        toothNumber: item.toothNumber,
        remarks: item.dentalRemarks || "N/A",
        paymentMethod: item.paymentMethod || "N/A",
        amount: item.amount || "0",
        dentist: dentist,
        status: item.status,
        createdAt: format(item.createdAt, "MMMM dd, yyyy"),
      };
    }) || [];

  const formattedDataTreatment: TreatmentColumn2[] =
    patient?.dentalRemarks?.map((item) => {
      return {
        id: item.id,
        toothNumber: item.toothNumber,
        diagnosis: item.diagnosis,
        remarks: item.dentalRemarks || "N/A",
        createdAt: format(item.createdAt, "MMMM dd, yyyy"),
      };
    }) || [];

  return (
    <>
      <TreatmentModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        toothNumber={modalData.toothNumber}
      />
      <DentalHistoryModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Card>
        <CardContent className="p-5">
          <h1 className="font-semibold text-lg">Patient Information</h1>
          <div className="flex flex-print items-center gap-1 border-b w-full mt-2">
            <p className="font-semibold">Name: </p>
            <p>{fullName}</p>
          </div>
          <div className="flex flex-print items-center gap-1 border-b w-full mt-2">
            <p className="font-semibold">Residential Address: </p>
            <p>{patient?.address}</p>
          </div>
          <div className="grid w-full md:grid-cols-4 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Birthday: </p>
              <p>
                {patient?.birthdate
                  ? format(new Date(patient.birthdate), "MMMM dd, yyyy")
                  : "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Marital Status: </p>
              <p>{patient?.maritalStatus}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Age: </p>
              <p>{patient?.age} years old</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Sex: </p>
              <p>{patient?.sex}</p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-2 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Contact Number: </p>
              <p>{patient?.contactNumber}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Birthplace (Hospital): </p>
              <p>{patient?.birthPlace}</p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-2 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Facebook Name: </p>
              <p>{patient?.facebookName}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Email Address: </p>
              <p>{patient?.email}</p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-3 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Occupation: </p>
              <p>{patient?.occupation}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Weight (kg): </p>
              <p>{patient?.weight} kg</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Height (cm): </p>
              <p>{patient?.height} cm</p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-3 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Father&apos;s Name: </p>
              <p>{patient?.fatherName || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Father&apos;s Occupation: </p>
              <p>{patient?.fatherOccupation || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Father&apos;s Contact Number: </p>
              <p>{patient?.fatherContactNumber || "N/A"}</p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-3 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Mother&apos;s Name: </p>
              <p>{patient?.motherName || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Mother&apos;s Occupation: </p>
              <p>{patient?.motherOccupation || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Mother&apos;s Contact Number: </p>
              <p>{patient?.motherContactNumber || "N/A"}</p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-3 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Guardian&apos;s Name: </p>
              <p>{patient?.guardianName || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Guardian&apos;s Relation: </p>
              <p>{patient?.guardianRelation || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Guardian&apos;s Contact Number: </p>
              <p>{patient?.guardianContactNumber || "N/A"}</p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-3 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Doctor&apos;s Name: </p>
              <p>{patient?.doctorName || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Doctor&apos;s Specialization: </p>
              <p>{patient?.doctorSpecialization || "N/A"}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Doctor&apos;s Contact Number: </p>
              <p>{patient?.doctorContactNumber || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 border-b w-full mt-2">
            <p className="font-semibold">Referred by: </p>
            <p>{patient?.referredBy || "N/A"}</p>
          </div>

          <div className="flex items-center gap-1 w-full mt-2">
            <p className="font-semibold">Reason for Consultation: </p>
            <p>{patient?.consultationReason}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardContent className="p-5">
          <h1 className="font-semibold text-lg mb-2">
            History of Present Illness
          </h1>
          <PresentHistoryIllnessForm
            initialData={presentHistoryIllness}
            patientId={patient?.id as string}
          />
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardContent className="p-5">
          <h1 className="font-semibold text-lg mb-2">Medical History</h1>
          <MedicalHistoryForm
            initialData={medicalHistory}
            patientId={patient?.id as string}
          />
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-lg">Dental Chart</h1>
          </div>
          <div className="grid md:grid-cols-10 grid-cols-1 mt-2 gap-5">
            <div className="col-span-6 flex flex-col">
              <div className="flex justify-center items-center gap-1">
                {UPPER_TEETH.map((tooth) => (
                  <div
                    key={tooth}
                    className={`relative md:w-[50px] md:h-[50px] w-7 h-7 ${
                      patient?.treatmentPlan.find(
                        (t) =>
                          t.toothNumber === tooth.toString() &&
                          t.patientId === patient.id
                      )
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      const isNotClickable = patient?.treatmentPlan.find(
                        (t) =>
                          t.toothNumber === tooth.toString() &&
                          t.patientId === patient.id
                      );
                      if (!isNotClickable) {
                        openModal(tooth.toString());
                      }
                    }}
                  >
                    <Image
                      className="w-full h-full"
                      src={`${
                        theme === "light"
                          ? "/dark-tooth.svg"
                          : "/light-tooth.svg"
                      }`}
                      alt="Tooth"
                      layout="fill"
                      objectFit="contain"
                    />
                    <p className="md:text-xs text-[10px] absolute inset-0 flex items-center mb-2 font-semibold justify-center">
                      {tooth}
                    </p>
                    <div
                      className={`absolute top-1 right-2 ${getToothStatus(
                        tooth.toString()
                      )}`}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-1 mt-2">
                <p className="md:mx-10 mx-2 md:text-md text-sm font-semibold">
                  RIGHT
                </p>
                <div className="flex items-center justify-center flex-col">
                  <div className="flex items-center gap-1">
                    {UPPER_MIDDLE_TEETH.map((tooth) => (
                      <div
                        key={tooth}
                        className={`relative md:w-[50px] md:h-[50px] w-7 h-7 ${
                          patient?.treatmentPlan.find(
                            (t) =>
                              t.toothNumber === tooth.toString() &&
                              t.patientId === patient.id
                          )
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => {
                          const isNotClickable = patient?.treatmentPlan.find(
                            (t) =>
                              t.toothNumber === tooth.toString() &&
                              t.patientId === patient.id
                          );
                          if (!isNotClickable) {
                            openModal(tooth.toString());
                          }
                        }}
                      >
                        <Image
                          className="w-full h-full"
                          src={`${
                            theme === "light"
                              ? "/dark-tooth.svg"
                              : "/light-tooth.svg"
                          }`}
                          alt="Tooth"
                          fill
                        />
                        <p className="md:text-xs text-[10px] absolute inset-0 flex items-center mb-2 font-semibold justify-center">
                          {tooth}
                        </p>
                        <div
                          className={`absolute text-xl top-1 right-2 ${getToothStatus(
                            tooth.toString()
                          )}`}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <p className="font-semibold md:text-md text-sm">lingual</p>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {LOWER_MIDDLE_TEETH.map((tooth) => (
                        <div
                          key={tooth}
                          className={`relative md:w-[50px] md:h-[50px] w-7 h-7 ${
                            patient?.treatmentPlan.find(
                              (t) =>
                                t.toothNumber === tooth.toString() &&
                                t.patientId === patient.id
                            )
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          onClick={() => {
                            const isNotClickable = patient?.treatmentPlan.find(
                              (t) =>
                                t.toothNumber === tooth.toString() &&
                                t.patientId === patient.id
                            );
                            if (!isNotClickable) {
                              openModal(tooth.toString());
                            }
                          }}
                        >
                          <Image
                            className="w-full h-full"
                            src={`${
                              theme === "light"
                                ? "/dark-tooth.svg"
                                : "/light-tooth.svg"
                            }`}
                            alt="Tooth"
                            fill
                          />
                          <p className="md:text-xs text-[10px] absolute inset-0 flex items-center mb-2 font-semibold justify-center">
                            {tooth}
                          </p>
                          <div
                            className={`absolute top-1 right-2 ${getToothStatus(
                              tooth.toString()
                            )}`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="md:mx-10 mx-2 font-semibold md:text-md text-sm">
                  LEFT
                </p>
              </div>
              <div className="flex justify-center items-center gap-1 mt-2">
                {LOWER_TEETH.map((tooth) => (
                  <div
                    key={tooth}
                    className={`relative w-[50px] h-[50px] ${
                      patient?.treatmentPlan.find(
                        (t) =>
                          t.toothNumber === tooth.toString() &&
                          t.patientId === patient.id
                      )
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      const isNotClickable = patient?.treatmentPlan.find(
                        (t) =>
                          t.toothNumber === tooth.toString() &&
                          t.patientId === patient.id
                      );
                      if (!isNotClickable) {
                        openModal(tooth.toString());
                      }
                    }}
                  >
                    <Image
                      className="w-full h-full"
                      src={`${
                        theme === "light"
                          ? "/dark-tooth.svg"
                          : "/light-tooth.svg"
                      }`}
                      alt="Tooth"
                      fill
                    />
                    <p className="md:text-xs text-[10px] absolute inset-0 flex items-center mb-2 font-semibold justify-center">
                      {tooth}
                    </p>
                    <div
                      className={`absolute top-1 right-2 ${getToothStatus(
                        tooth.toString()
                      )}`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-4" data-html2canvas-ignore>
              <p className="font-semibold mb-2">Legend:</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="size-3 border-2 border-red-600"></div>
                  <p> - Decal</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-red-600"></div>
                  <p> - Caries</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full border-2 border-black"></div>
                  <p> - Recurrent</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-red-600 w-[2px] h-6 rotate-45"></div>
                  <p> - For EXO</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-red-600">/\/\/\</div>
                  <p> - Abraided/Attrition</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 bg-red-500 rotate-12"></div>
                  <p> - Severe</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-red-600">IMP</div>
                  <p> - Impacted</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-red-600 w-4 h-[2px]"></div>
                  <div className="bg-red-600 w-[2px] h-4"></div>
                  <p> - Incipient</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-full bg-black"></div>
                  <p> - CO or AM</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="arrow-up"></div>
                  <div className="arrow-down"></div>
                  <p> - Erupting</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-black w-[2px] h-6 rotate-45"></div>
                  <p> - Extracted</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-black">S</div>
                  <p> - Sealant</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-red-500">*</div>
                  <p> - Others</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-lg">Treatment Plan</h1>
          </div>
          <DataTable
            data={formattedDataTreatment}
            searchKey="toothNumber"
            columns={columns2}
          />
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <h1 className="font-semibold text-lg">Treatment Rendered</h1>
            <Button
              className="no-print"
              data-html2canvas-ignore
              size="sm"
              onClick={() => setIsOpen(true)}
            >
              <PlusCircle className="mr-2 w-4 h-4" /> Add
            </Button>
          </div>
          <DataTable
            data={formattedData}
            searchKey="service"
            columns={columns}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default TreatmentClient;
