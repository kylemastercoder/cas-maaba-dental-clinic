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
import { Patient, Service, TreatmentPlan } from "@prisma/client";
import { differenceInYears, format } from "date-fns";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { columns, TreatmentColumn } from "./column";
import { getAllServices } from "@/actions/service";
import { useTheme } from "next-themes";

export interface PatientWithTreatment extends Patient {
  treatmentPlan: TreatmentPlan[];
}

const TreatmentClient = ({
  patient,
}: {
  patient: PatientWithTreatment | null;
}) => {
  const { theme } = useTheme();
  const [services, setServices] = useState<Service[]>([]);
  const fullName = `${patient?.firstName} ${patient?.middleName} ${patient?.lastName}`;
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    toothNumber: number | null;
  }>({ isOpen: false, toothNumber: null });

  const openModal = (toothNumber: number) => {
    setModalData({ isOpen: true, toothNumber });
  };

  const getToothStatus = (toothNumber: number) => {
    const treatment = patient?.treatmentPlan.find(
      (t) => t.toothNumber === toothNumber && t.patientId === patient.id
    );

    if (treatment) {
      switch (treatment.diagnosis) {
        case "Decal":
          return "size-3 border-2 border-red-600"; // Decal status
        case "Caries":
          return "size-3 rounded-full bg-red-600"; // Caries status
        case "Recurrent":
          return "size-3 rounded-full border-2 border-black"; // Recurrent status
        case "For EXO":
          return "bg-red-600 w-[2px] h-6 rotate-45"; // For EXO status
        case "Abraided/Attrition abraided":
          return "text-red-600"; // Abraided/Attrition status
        case "Severe":
          return "w-3 h-2 bg-red-500 rotate-12"; // Severe status
        case "Impacted":
          return "text-red-600"; // Impacted status
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
        default:
          return "";
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

  const formattedData: TreatmentColumn[] =
    patient?.treatmentPlan?.map((item) => {
      const service =
        services.find((s) => s.id === item.serviceId)?.name ??
        "Unknown Service";
      return {
        id: item.id,
        service: service,
        serviceId: item.serviceId ?? '',
        toothNumber: item.toothNumber,
        diagnosis: item.diagnosis,
        remarks: item.dentalRemarks || "N/A",
        paymentMethod: item.paymentMethod,
        status: item.status,
        createdAt: format(item.createdAt, "MMMM do, yyyy"),
      };
    }) || [];

  return (
    <>
      <TreatmentModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData({ ...modalData, isOpen: false })}
        toothNumber={modalData.toothNumber}
      />
      <Card>
        <CardContent className="p-5">
          <h1 className="font-semibold text-lg">Patient Information</h1>
          <div className="grid w-full md:grid-cols-2 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Name: </p>
              <p>{fullName}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Sex: </p>
              <p>{patient?.sex}</p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-2 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Email Address: </p>
              <p>{patient?.email}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Facebook Name: </p>
              <p>{patient?.facebookName}</p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-2 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Birthday: </p>
              <p>
                {patient?.birthdate
                  ? format(new Date(patient.birthdate), "MMMM dd, yyyy")
                  : "N/A"}
              </p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Age: </p>
              <p>
                {patient?.birthdate
                  ? differenceInYears(new Date(), new Date(patient.birthdate))
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="grid w-full md:grid-cols-2 grid-cols-1 md:gap-5 gap-2 mt-2">
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Occupation: </p>
              <p>{patient?.occupation}</p>
            </div>
            <div className="flex items-center gap-1 border-b w-full">
              <p className="font-semibold">Marital Status: </p>
              <p>{patient?.maritalStatus}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardContent className="p-5">
          <h1 className="font-semibold text-lg">Treatment Rendered</h1>
          <DataTable
            data={formattedData}
            searchKey="service"
            columns={columns}
          />
        </CardContent>
      </Card>
      <Card className="mt-5">
        <CardContent className="p-5">
          <h1 className="font-semibold text-lg">Dental Chart</h1>
          <div className="grid md:grid-cols-10 grid-cols-1 mt-2 gap-5">
            <div className="col-span-6 flex flex-col">
              <div className="flex justify-center items-center gap-1">
                {UPPER_TEETH.map((tooth) => (
                  <div
                    key={tooth}
                    className={`relative md:w-[50px] md:h-[50px] w-7 h-7 ${
                      patient?.treatmentPlan.find(
                        (t) =>
                          t.toothNumber === tooth && t.patientId === patient.id
                      )
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      const isNotClickable = patient?.treatmentPlan.find(
                        (t) =>
                          t.toothNumber === tooth && t.patientId === patient.id
                      );
                      if (!isNotClickable) {
                        openModal(tooth);
                      }
                    }}
                  >
                    <Image
                      className="w-full h-full"
                      src={`${theme === "light" ? "/dark-tooth.svg" : "/light-tooth.svg"}`}
                      alt="Tooth"
                      layout="fill"
                      objectFit="contain"
                      
                    />
                    <p className="md:text-xs text-[10px] absolute inset-0 flex items-center mb-2 font-semibold justify-center">
                      {tooth}
                    </p>
                    <div
                      className={`absolute top-1 right-2 ${getToothStatus(
                        tooth
                      )}`}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-center items-center gap-1 mt-2">
                <p className="md:mx-10 mx-2 md:text-md text-sm font-semibold">RIGHT</p>
                <div className="flex items-center justify-center flex-col">
                  <div className="flex items-center gap-1">
                    {UPPER_MIDDLE_TEETH.map((tooth) => (
                      <div
                        key={tooth}
                        className={`relative md:w-[50px] md:h-[50px] w-7 h-7 ${
                          patient?.treatmentPlan.find(
                            (t) =>
                              t.toothNumber === tooth &&
                              t.patientId === patient.id
                          )
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={() => {
                          const isNotClickable = patient?.treatmentPlan.find(
                            (t) =>
                              t.toothNumber === tooth &&
                              t.patientId === patient.id
                          );
                          if (!isNotClickable) {
                            openModal(tooth);
                          }
                        }}
                      >
                        <Image
                          className="w-full h-full"
                          src={`${theme === "light" ? "/dark-tooth.svg" : "/light-tooth.svg"}`}
                          alt="Tooth"
                          fill
                        />
                        <p className="md:text-xs text-[10px] absolute inset-0 flex items-center mb-2 font-semibold justify-center">
                          {tooth}
                        </p>
                        <div
                          className={`absolute top-1 right-2 ${getToothStatus(
                            tooth
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
                                t.toothNumber === tooth &&
                                t.patientId === patient.id
                            )
                              ? "cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                          onClick={() => {
                            const isNotClickable = patient?.treatmentPlan.find(
                              (t) =>
                                t.toothNumber === tooth &&
                                t.patientId === patient.id
                            );
                            if (!isNotClickable) {
                              openModal(tooth);
                            }
                          }}
                        >
                          <Image
                            className="w-full h-full"
                            src={`${theme === "light" ? "/dark-tooth.svg" : "/light-tooth.svg"}`}
                            alt="Tooth"
                            fill
                          />
                          <p className="md:text-xs text-[10px] absolute inset-0 flex items-center mb-2 font-semibold justify-center">
                            {tooth}
                          </p>
                          <div
                            className={`absolute top-1 right-2 ${getToothStatus(
                              tooth
                            )}`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="md:mx-10 mx-2 font-semibold md:text-md text-sm">LEFT</p>
              </div>
              <div className="flex justify-center items-center gap-1 mt-2">
                {LOWER_TEETH.map((tooth) => (
                  <div
                    key={tooth}
                    className={`relative w-[50px] h-[50px] ${
                      patient?.treatmentPlan.find(
                        (t) =>
                          t.toothNumber === tooth && t.patientId === patient.id
                      )
                        ? "cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                    onClick={() => {
                      const isNotClickable = patient?.treatmentPlan.find(
                        (t) =>
                          t.toothNumber === tooth && t.patientId === patient.id
                      );
                      if (!isNotClickable) {
                        openModal(tooth);
                      }
                    }}
                  >
                    <Image
                      className="w-full h-full"
                      src={`${theme === "light" ? "/dark-tooth.svg" : "/light-tooth.svg"}`}
                      alt="Tooth"
                      fill
                    />
                    <p className="md:text-xs text-[10px] absolute inset-0 flex items-center mb-2 font-semibold justify-center">
                      {tooth}
                    </p>
                    <div
                      className={`absolute top-1 right-2 ${getToothStatus(
                        tooth
                      )}`}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-4">
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default TreatmentClient;
