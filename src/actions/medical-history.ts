/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import { MedicalHistorySchema } from "@/lib/validators";
import { z } from "zod";

export const createMedicalHistory = async (
  values: z.infer<typeof MedicalHistorySchema>,
  patientId: string
) => {
  const { user } = await getUserFromCookies();
  const validatedField = MedicalHistorySchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    currentMedication,
    previousHospitalization,
    allergies,
    developmentalAbnormalities,
    histories,
    medicalCareReaction,
    yesSpecify,
    socialFamilyHistory,
  } = validatedField.data;

  try {
    const medicalHistory = await db.medicalHistory.create({
      data: {
        currentMedication,
        previousHospitalization,
        allergies,
        developmentalAbnormalities,
        histories,
        medicalCareReaction,
        yesSpecify,
        socialFamilyHistory,
        patientId,
      },
      include: {
        patient: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (medicalHistory) {
      await db.logs.create({
        data: {
          action: `${user?.name} added medical history for ${medicalHistory.patient.firstName} ${medicalHistory.patient.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return { success: "Medical history created successfully", medicalHistory };
  } catch (error: any) {
    return {
      error: `Failed to create medical history. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
