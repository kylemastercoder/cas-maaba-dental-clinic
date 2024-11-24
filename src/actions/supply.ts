/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import {
  AddStockSchema,
  DeductStockSchema,
  SupplySchema,
} from "@/lib/validators";
import { z } from "zod";
import { getUserFromCookies } from "@/hooks/use-user";

export const getAllSupplies = async () => {
  try {
    const data = await db.supplies.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        unit: true,
        branch: true,
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

  const { name, category, used, stocks, unit, branchId, sku } =
    validatedField.data;

  try {
    const supply = await db.supplies.create({
      data: {
        name,
        sku,
        category,
        used: used || 0,
        unitId: unit,
        quantity: stocks,
        branchId,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (supply) {
      await db.logs.create({
        data: {
          action: `${user?.name} added ${supply.name} on ${loginTime}`,
          branchId: user?.branchId || "",
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

  const { name, category, used, stocks, unit, branchId, sku } =
    validatedField.data;

  try {
    const supply = await db.supplies.update({
      data: {
        name,
        category,
        sku,
        used: used || 0,
        unitId: unit,
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
          branchId: user?.branchId || "",
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
          branchId: user?.branchId || "",
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

export const updateStock = async (supplyId: string, stockChange: number) => {
  const { user } = await getUserFromCookies();
  if (!supplyId) {
    return { error: "Supply ID is required." };
  }

  try {
    // Fetch the current supply data to get the current stock
    const supply = await db.supplies.findUnique({
      where: { id: supplyId },
    });

    if (!supply) {
      return { error: "Supply not found." };
    }

    // Calculate the new quantity (current stock + stock change)
    const newQuantity = Math.max(0, supply.quantity + stockChange); // Prevent going below 0

    // Update the stock in the database
    const updatedSupply = await db.supplies.update({
      where: { id: supplyId },
      data: { quantity: newQuantity },
    });

    const loginTime = formatTimeStamp(new Date());

    // Log the stock update action
    if (updatedSupply) {
      await db.logs.create({
        data: {
          action: `${user?.name} updated ${updatedSupply.name} stock on ${loginTime}`,
          branchId: user?.branchId || "",
        },
      });
    }

    return { success: "Stock updated successfully", supply: updatedSupply };
  } catch (error: any) {
    return {
      error: `Failed to update stock. Please try again. ${error.message || ""}`,
    };
  }
};

export const addStock = async (
  supplyId: string,
  values: z.infer<typeof AddStockSchema>
) => {
  const { user } = await getUserFromCookies();
  const validatedField = AddStockSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { quantity, receivedBy, remarks } = validatedField.data;

  try {
    // Fetch the current supply data to get the current stock
    const supply = await db.supplies.findFirst({
      where: { id: supplyId },
    });

    if (!supply) {
      return { error: "Supply not found." };
    }

    // Calculate the new quantity (current stock + stock change)
    const newQuantity = Math.max(0, supply.quantity + quantity);

    // Update the stock in the database
    const updatedSupply = await db.supplies.update({
      where: { id: supplyId },
      data: { quantity: newQuantity },
    });

    const loginTime = formatTimeStamp(new Date());

    // Log the stock update action
    if (updatedSupply) {
      await db.logs.create({
        data: {
          action: `${receivedBy} received ${quantity} stock to ${updatedSupply.name} on ${loginTime} with a remarks of ${remarks}`,
          branchId: user?.branchId || "",
        },
      });
    }

    return { success: "Stock added successfully", supply: updatedSupply };
  } catch (error: any) {
    return {
      error: `Failed to add stock. Please try again. ${error.message || ""}`,
    };
  }
};

export const deductStock = async (
  supplyId: string,
  values: z.infer<typeof DeductStockSchema>
) => {
  const { user } = await getUserFromCookies();
  const validatedField = DeductStockSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { quantity, dispatchedBy, remarks } = validatedField.data;

  try {
    // Fetch the current supply data to get the current stock
    const supply = await db.supplies.findFirst({
      where: { id: supplyId },
    });

    if (!supply) {
      return { error: "Supply not found." };
    }

    // Calculate the new quantity (current stock - stock change)
    const newQuantity = Math.max(0, supply.quantity - quantity);

    // Update the stock in the database
    const updatedSupply = await db.supplies.update({
      where: { id: supplyId },
      data: { quantity: newQuantity },
    });

    const loginTime = formatTimeStamp(new Date());

    // Log the stock update action
    if (updatedSupply) {
      await db.logs.create({
        data: {
          action: `${dispatchedBy} deducted ${quantity} stock to ${updatedSupply.name} on ${loginTime} with a remarks of ${remarks}`,
          branchId: user?.branchId || "",
        },
      });
    }

    return { success: "Stock deducted successfully", supply: updatedSupply };
  } catch (error: any) {
    return {
      error: `Failed to deduct stock. Please try again. ${error.message || ""}`,
    };
  }
};
