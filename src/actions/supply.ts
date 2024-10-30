/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import { SupplySchema } from "@/lib/validators";
import { z } from "zod";
import { getUserFromCookies } from "@/hooks/use-user";

export const getAllSupplies = async () => {
  try {
    const data = await db.supplies.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!data) {
      return { error: "No supplies found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createSupply = async (values: z.infer<typeof SupplySchema>) => {
  const { user } = await getUserFromCookies();
  const validatedField = SupplySchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, category, used, stocks, unit, branchId } = validatedField.data;

  try {
    const supply = await db.supplies.create({
      data: {
        name,
        category,
        used: used || 0,
        unit,
        quantity: stocks,
        branchId,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (supply) {
      await db.logs.create({
        data: {
          action: `${user?.name} added ${supply.name} on ${loginTime}`,
        },
      });
    }

    return { success: "Supply created successfully", supply };
  } catch (error: any) {
    return {
      error: `Failed to create supply. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const updateSupply = async (
  values: z.infer<typeof SupplySchema>,
  supplyId: string
) => {
  const { user } = await getUserFromCookies();
  const validatedField = SupplySchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, category, used, stocks, unit, branchId } = validatedField.data;

  try {
    const supply = await db.supplies.update({
      data: {
        name,
        category,
        used: used || 0,
        unit,
        quantity: stocks,
        branchId,
      },
      where: {
        id: supplyId,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (supply) {
      await db.logs.create({
        data: {
          action: `${user?.name} updated ${supply.name} on ${loginTime}`,
        },
      });
    }

    return { success: "Supply updated successfully", supply };
  } catch (error: any) {
    return {
      error: `Failed to update supply. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const deleteSupply = async (supplyId: string) => {
  const { user } = await getUserFromCookies();
  if (!supplyId) {
    return { error: "Supply ID is required." };
  }

  try {
    const supply = await db.supplies.delete({
      where: {
        id: supplyId,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (supply) {
      await db.logs.create({
        data: {
          action: `${user?.name} deleted ${supply.name} on ${loginTime}`,
        },
      });
    }

    return { success: "Supply deleted successfully", supply };
  } catch (error: any) {
    return {
      error: `Failed to delete supply. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
