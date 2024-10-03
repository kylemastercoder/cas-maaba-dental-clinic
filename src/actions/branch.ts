/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { BranchSchema } from "@/lib/validators";
import db from "@/lib/db";

export const createBranch = async (values: z.infer<typeof BranchSchema>) => {
  const validatedField = BranchSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, address, branchHead } = validatedField.data;

  try {
    const branch = await db.branch.create({
      data: {
        name,
        address,
        userId: branchHead,
      },
    });

    return { success: "Branch created successfully", branch };
  } catch (error: any) {
    return {
      error: `Failed to create branch. Please try again. ${
        error.message || ""
      }`,
    };
  }
};

export const getAllBranches = async () => {
  try {
    const data = await db.branch.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    if (!data) {
      return { error: "No branch found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};
