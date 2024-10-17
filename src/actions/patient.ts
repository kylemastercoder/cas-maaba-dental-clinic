/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { PatientSchema } from "@/lib/validators";
import { z } from "zod";

export const getAllPatients = async () => {
  try {
    const data = await db.patient.findMany({
      orderBy: {
        createdAt: "asc",
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
      },
    });

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
      },
      where: {
        id: patientId,
      }
    });

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
  if (!patientId) {
    return { error: "Patient ID is required." };
  }

  try {
    const patient = await db.patient.delete({
      where: {
        id: patientId,
      },
    });

    return { success: "Patient deleted successfully", patient };
  } catch (error: any) {
    return {
      error: `Failed to delete patient. Please try again. ${error.message || ""}`,
    };
  }
};
