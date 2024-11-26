/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import { MedicalHistorySchema, PresentIllnessSchema } from "@/lib/validators";
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

export const updateMedicalHistory = async (
  values: z.infer<typeof MedicalHistorySchema>,
  medicalHistoryId: string
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
    const medicalHistory = await db.medicalHistory.update({
      where: {
        id: medicalHistoryId,
      },
      data: {
        currentMedication,
        previousHospitalization,
        allergies,
        developmentalAbnormalities,
        histories,
        medicalCareReaction,
        yesSpecify,
        socialFamilyHistory,
      },
      include: {
        patient: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (medicalHistory) {
      await db.logs.create({
        data: {
          action: `${user?.name} updated medical history for ${medicalHistory.patient.firstName} ${medicalHistory.patient.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return { success: "Medical history updated successfully", medicalHistory };
  } catch (error: any) {
    return {
      error: `Failed to update medical history. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createPresentIllness = async (
  values: z.infer<typeof PresentIllnessSchema>,
  patientId: string
) => {
  const { user } = await getUserFromCookies();
  const validatedField = PresentIllnessSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name } = validatedField.data;

  try {
    const presentIllness = await db.presentHistoryIllness.create({
      data: {
        name,
        patientId,
      },
      include: {
        patient: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (presentIllness) {
      await db.logs.create({
        data: {
          action: `${user?.name} added history of present illness for ${presentIllness.patient.firstName} ${presentIllness.patient.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return {
      success: "History of present illness created successfully",
      presentIllness,
    };
  } catch (error: any) {
    return {
      error: `Failed to create history of present illness. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updatePresentIllness = async (
  values: z.infer<typeof PresentIllnessSchema>,
  presentIllnessId: string
) => {
  const { user } = await getUserFromCookies();
  const validatedField = PresentIllnessSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name } = validatedField.data;

  try {
    const presentIllness = await db.presentHistoryIllness.update({
      where: {
        id: presentIllnessId,
      },
      data: {
        name,
      },
      include: {
        patient: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (presentIllness) {
      await db.logs.create({
        data: {
          action: `${user?.name} updated history of present illness for ${presentIllness.patient.firstName} ${presentIllness.patient.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return {
      success: "History of present illness updated successfully",
      presentIllness,
    };
  } catch (error: any) {
    return {
      error: `Failed to update history of present illness. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
