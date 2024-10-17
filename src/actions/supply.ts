/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { SupplySchema } from "@/lib/validators";
import { z } from "zod";

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
  const validatedField = SupplySchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, category, used, stocks, unit } = validatedField.data;

  try {
    const supply = await db.supplies.create({
      data: {
        name,
        category,
        used: used || 0,
        unit,
        quantity: stocks,
      },
    });

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
  const validatedField = SupplySchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, category, used, stocks, unit } = validatedField.data;

  try {
    const supply = await db.supplies.update({
      data: {
        name,
        category,
        used: used || 0,
        unit,
        quantity: stocks,
      },
      where: {
        id: supplyId,
      }
    });

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
  if (!supplyId) {
    return { error: "Supply ID is required." };
  }

  try {
    const supply = await db.supplies.delete({
      where: {
        id: supplyId,
      },
    });

    return { success: "Supply deleted successfully", supply };
  } catch (error: any) {
    return {
      error: `Failed to delete supply. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
