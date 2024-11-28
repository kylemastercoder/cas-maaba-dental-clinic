/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import { DentalHistorySchema, TreatmentPlanSchema } from "@/lib/validators";
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
    diagnosis,
    remarks,
  } = validatedField.data;

  try {
    const dentalRemarks = await db.dentalRemarks.create({
      data: {
        toothNumber,
        diagnosis,
        dentalRemarks: remarks ?? "",
        patientId,
      },
      include: {
        patient: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (dentalRemarks) {
      await db.logs.create({
        data: {
          action: `${user?.name} added ${diagnosis} for ${toothNumber} to ${dentalRemarks.patient?.firstName} ${dentalRemarks.patient?.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return { success: "Dental remarks created successfully", dentalRemarks };
  } catch (error: any) {
    return {
      error: `Failed to create dental remarks. Please try again. ${
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
    diagnosis,
    remarks,
  } = validatedField.data;

  try {
    const dentalRemarks = await db.dentalRemarks.update({
      where: {
        id: treatmentId,
      },
      data: {
        toothNumber,
        diagnosis,
        dentalRemarks: remarks ?? "",
      },
      include: {
        patient: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (dentalRemarks) {
      await db.logs.create({
        data: {
          action: `${user?.name} updated ${diagnosis} for ${toothNumber} to ${dentalRemarks.patient?.firstName} ${dentalRemarks.patient?.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return { success: "Dental remarks updated successfully", dentalRemarks };
  } catch (error: any) {
    return {
      error: `Failed to updated dental remarks. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const createDentalHistory = async (
  values: z.infer<typeof DentalHistorySchema>,
  patientId: string
) => {
  const { user } = await getUserFromCookies();
  const validatedField = DentalHistorySchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    toothNumber,
    remarks,
    service,
    dentist,
  } = validatedField.data;

  try {
    const treatmentPlan = await db.treatmentPlan.create({
      data: {
        toothNumber,
        dentalRemarks: remarks ?? "",
        patientId,
        serviceId: service,
        dentistId: dentist,
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

export const updateDentalHistory = async (
  values: z.infer<typeof DentalHistorySchema>,
  treatmentId: string
) => {
  const { user } = await getUserFromCookies();
  const validatedField = DentalHistorySchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    toothNumber,
    remarks,
    service,
    dentist,
    amount,
    paymentMethod,
    status
  } = validatedField.data;

  try {
    const treatmentPlan = await db.treatmentPlan.update({
      where: {
        id: treatmentId,
      },
      data: {
        toothNumber,
        dentalRemarks: remarks ?? "",
        serviceId: service,
        dentistId: dentist,
        amount,
        paymentMethod,
        status,
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
          action: `${user?.name} updated ${treatmentPlan?.service?.name} for ${toothNumber} to ${treatmentPlan.patient?.firstName} ${treatmentPlan.patient?.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return { success: "Treatment plan updated successfully", treatmentPlan };
  } catch (error: any) {
    return {
      error: `Failed to update treatment plan. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteTreatmentPlan = async (treatmentId: string) => {
  const { user } = await getUserFromCookies();

  try {
    const dentalRemarks = await db.dentalRemarks.delete({
      where: {
        id: treatmentId,
      },
      include: {
        patient: true,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (dentalRemarks) {
      await db.logs.create({
        data: {
          action: `${user?.name} deleted ${dentalRemarks.toothNumber} to ${dentalRemarks.patient?.firstName} ${dentalRemarks.patient?.lastName} on ${loginTime}`,
          branchId: user?.branchId ?? "",
        },
      });
    }

    return { success: "Dental remarks deleted successfully", dentalRemarks };
  } catch (error: any) {
    return {
      error: `Failed to delete dental remarks. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
