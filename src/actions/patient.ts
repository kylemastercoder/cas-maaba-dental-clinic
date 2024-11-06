/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import { PatientSchema } from "@/lib/validators";
import { z } from "zod";

export const getAllPatients = async () => {
  try {
    const data = await db.patient.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No patient found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createPatient = async (values: z.infer<typeof PatientSchema>) => {
  const { user } = await getUserFromCookies();
  const validatedField = PatientSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    firstName,
    middleName,
    lastName,
    suffix,
    facebookName,
    email,
    houseNumber,
    region,
    province,
    municipality,
    barangay,
    sex,
    birthdate,
    maritalStatus,
    occupation,
    contactNumber,
    branchId
  } = validatedField.data;

  const address = `${houseNumber}, ${barangay}, ${municipality}, ${province}, ${region}`;

  try {
    const patient = await db.patient.create({
      data: {
        firstName,
        middleName,
        lastName,
        suffix,
        facebookName,
        email,
        address,
        sex,
        birthdate,
        maritalStatus,
        occupation,
        contactNumber,
        branchId
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (patient) {
      await db.logs.create({
        data: {
          action: `${user?.name} added ${patient.firstName} ${patient.lastName} on ${loginTime}`,
        },
      });
    }

    return { success: "Patient created successfully", patient };
  } catch (error: any) {
    return {
      error: `Failed to create patient. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updatePatient = async (values: z.infer<typeof PatientSchema>, patientId: string) => {
  const { user } = await getUserFromCookies();
  const validatedField = PatientSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const {
    firstName,
    middleName,
    lastName,
    suffix,
    facebookName,
    email,
    houseNumber,
    region,
    province,
    municipality,
    barangay,
    sex,
    birthdate,
    maritalStatus,
    occupation,
    contactNumber,
    branchId
  } = validatedField.data;

  const address = `${houseNumber}, ${barangay}, ${municipality}, ${province}, ${region}`;

  try {
    const patient = await db.patient.update({
      data: {
        firstName,
        middleName,
        lastName,
        suffix,
        facebookName,
        email,
        address,
        sex,
        birthdate,
        maritalStatus,
        occupation,
        contactNumber,
        branchId
      },
      where: {
        id: patientId,
      }
    });

    const loginTime = formatTimeStamp(new Date());

    if (patient) {
      await db.logs.create({
        data: {
          action: `${user?.name} updated ${patient.firstName} ${patient.lastName} on ${loginTime}`,
        },
      });
    }

    return { success: "Patient updated successfully", patient };
  } catch (error: any) {
    return {
      error: `Failed to update patient. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deletePatient = async (patientId: string) => {
  const { user } = await getUserFromCookies();
  if (!patientId) {
    return { error: "Patient ID is required." };
  }

  try {
    const patient = await db.patient.update({
      where: {
        id: patientId,
      },
      data: {
        isActive: false,
      }
    });

    const loginTime = formatTimeStamp(new Date());

    if (patient) {
      await db.logs.create({
        data: {
          action: `${user?.name} became inactive ${patient.firstName} ${patient.lastName} on ${loginTime}`,
        },
      });
    }

    return { success: "Patient inactive successfully", patient };
  } catch (error: any) {
    console.error(error);
    return {
      error: `Failed to inactive patient. Please try again. ${error.message || ""}`,
    };
  }
};
