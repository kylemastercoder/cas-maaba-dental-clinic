/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { ServiceSchema } from "@/lib/validators";
import { z } from "zod";

export const getAllServices = async () => {
  try {
    const data = await db.service.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!data) {
      return { error: "No service found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createService = async (values: z.infer<typeof ServiceSchema>) => {
  const validatedField = ServiceSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, description } = validatedField.data;

  try {
    const service = await db.service.create({
      data: {
        name,
        description,
      },
    });

    return { success: "Service created successfully", service };
  } catch (error: any) {
    return {
      error: `Failed to create service. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateService = async (
  values: z.infer<typeof ServiceSchema>,
  serviceId: string
) => {
  const validatedField = ServiceSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, description } = validatedField.data;

  try {
    const service = await db.service.update({
      data: {
        name,
        description,
      },
      where: {
        id: serviceId,
      },
    });

    return { success: "Service updated successfully", service };
  } catch (error: any) {
    return {
      error: `Failed to update service. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteService = async (serviceId: string) => {
  if (!serviceId) {
    return { error: "Service ID is required." };
  }

  try {
    const service = await db.service.delete({
      where: {
        id: serviceId,
      },
    });

    return { success: "Service deleted successfully", service };
  } catch (error: any) {
    return {
      error: `Failed to delete service. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
