/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { z } from "zod";
import { BranchSchema } from "@/lib/validators";
import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import { getUserFromCookies } from "@/hooks/use-user";

export const createBranch = async (values: z.infer<typeof BranchSchema>) => {
  const { user } = await getUserFromCookies();
  const validatedField = BranchSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { error: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, address, gmail } = validatedField.data;

  try {
    const branch = await db.branch.create({
      data: {
        name,
        address,
        gmail,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (branch) {
      await db.logs.create({
        data: {
          action: `${user?.name} added ${branch.name} on ${loginTime}`,
          branchId: branch.id,
          userId: user?.id || "",
        },
      });
    }

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
        name: "asc",
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
