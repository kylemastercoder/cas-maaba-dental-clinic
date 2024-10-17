/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { TreatmentPlanSchema } from "@/lib/validators";
import { z } from "zod";

export const getAllTreatmentPlanByPatient = async (patientId: string) => {
  try {
    const data = await db.treatmentPlan.findMany({
      orderBy: {
        createdAt: "asc",
      },
      where: {
        patientId
      }
    });

    if (!data) {
      return { error: "No treatment plan found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createTreatmentPlan = async (
  values: z.infer<typeof TreatmentPlanSchema>,
  patientId: string
) => {
  const validatedField = TreatmentPlanSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { toothNumber, service, diagnosis, remarks } = validatedField.data;

  try {
    const treatmentPlan = await db.treatmentPlan.create({
      data: {
        toothNumber,
        serviceId: service,
        diagnosis,
        dentalRemarks: remarks ?? "",
        patientId,
      },
    });

    return { success: "Treatment plan created successfully", treatmentPlan };
  } catch (error: any) {
    return {
      error: `Failed to create treatment plan. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
