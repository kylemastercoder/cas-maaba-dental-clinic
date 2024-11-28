/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";

export const getAllUnits = async () => {
  try {
    const data = await db.units.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No units found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createUnit = async (name: string) => {
  const { user } = await getUserFromCookies();
  try {
    const unit = await db.units.create({
      data: {
        name,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (unit) {
      await db.logs.create({
        data: {
          action: `${user?.name} added ${unit.name} on ${loginTime}`,
          branchId: user?.branchId || "",
          userId: user?.id || "",
        },
      });
    }

    return { success: "Unit created successfully", unit };
  } catch (error: any) {
    return {
      error: `Failed to create unit. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
