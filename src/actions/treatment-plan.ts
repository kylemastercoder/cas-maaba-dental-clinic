/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import { TreatmentPlanSchema } from "@/lib/validators";
import { z } from "zod";

export const getAllTreatmentPlanByPatient = async (patientId: string) => {
  try {
    const data = await db.treatmentPlan.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        patientId,
      },
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
  const { user } = await getUserFromCookies();
  const validatedField = TreatmentPlanSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    toothNumber,
    service,
    diagnosis,
    remarks,
    status,
    isPaid,
    paymentMethod,
  } = validatedField.data;

  try {
    const treatmentPlan = await db.treatmentPlan.create({
      data: {
        toothNumber,
        serviceId: service,
        diagnosis,
        dentalRemarks: remarks ?? "",
        patientId,
        paymentMethod,
        status,
        isPaid,
      },
      include: {
        patient: true,
        service: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (treatmentPlan) {
      await db.logs.create({
        data: {
          action: `${user?.name} added ${treatmentPlan.service?.name} for ${toothNumber} to ${treatmentPlan.patient?.firstName} ${treatmentPlan.patient?.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return { success: "Treatment plan created successfully", treatmentPlan };
  } catch (error: any) {
    return {
      error: `Failed to create treatment plan. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateTreatmentPlan = async (
  values: z.infer<typeof TreatmentPlanSchema>,
  treatmentId: string
) => {
  const { user } = await getUserFromCookies();
  const validatedField = TreatmentPlanSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    toothNumber,
    service,
    diagnosis,
    remarks,
    status,
    isPaid,
    paymentMethod,
  } = validatedField.data;

  try {
    const treatmentPlan = await db.treatmentPlan.update({
      where: {
        id: treatmentId,
      },
      data: {
        toothNumber,
        serviceId: service,
        diagnosis,
        dentalRemarks: remarks ?? "",
        paymentMethod,
        status,
        isPaid,
      },
      include: {
        patient: true,
        service: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (treatmentPlan) {
      await db.logs.create({
        data: {
          action: `${user?.name} updated ${treatmentPlan.service?.name} for ${toothNumber} to ${treatmentPlan.patient?.firstName} ${treatmentPlan.patient?.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return { success: "Treatment plan updated successfully", treatmentPlan };
  } catch (error: any) {
    return {
      error: `Failed to updated treatment plan. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteTreatmentPlan = async (treatmentId: string) => {
  const { user } = await getUserFromCookies();

  try {
    const treatmentPlan = await db.treatmentPlan.delete({
      where: {
        id: treatmentId,
      },
      include: {
        patient: true,
        service: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (treatmentPlan) {
      await db.logs.create({
        data: {
          action: `${user?.name} deleted ${treatmentPlan.toothNumber} to ${treatmentPlan.patient?.firstName} ${treatmentPlan.patient?.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return { success: "Treatment plan deleted successfully", treatmentPlan };
  } catch (error: any) {
    return {
      error: `Failed to deleted treatment plan. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
