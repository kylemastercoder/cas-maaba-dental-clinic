/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import { ServiceSchema } from "@/lib/validators";
import { z } from "zod";

export const getAllServices = async () => {
  try {
    const data = await db.service.findMany({
      orderBy: {
        createdAt: "desc",
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
  const { user } = await getUserFromCookies();
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
        description: description || "",
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (service) {
      await db.logs.create({
        data: {
          action: `${user?.name} added ${service.name} on ${loginTime}`,
          branchId: user?.branchId ?? "",
          userId: user?.id || "",
        },
      });
    }

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
  const { user } = await getUserFromCookies();
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
        description: description || "",
      },
      where: {
        id: serviceId,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (service) {
      await db.logs.create({
        data: {
          action: `${user?.name} updated ${service.name} on ${loginTime}`,
          branchId: user?.branchId ?? "",
          userId: user?.id || "",
        },
      });
    }

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
  const { user } = await getUserFromCookies();
  if (!serviceId) {
    return { error: "Service ID is required." };
  }

  try {
    const service = await db.service.delete({
      where: {
        id: serviceId,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (service) {
      await db.logs.create({
        data: {
          action: `${user?.name} deleted ${service.name} on ${loginTime}`,
          branchId: user?.branchId ?? "",
          userId: user?.id || "",
        },
      });
    }

    return { success: "Service deleted successfully", service };
  } catch (error: any) {
    return {
      error: `Failed to delete service. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
