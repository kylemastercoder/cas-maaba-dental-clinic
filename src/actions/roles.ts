/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { formatTimeStamp } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export const getAllRoles = async () => {
  try {
    const data = await db.role.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        NOT: {
          name: "Administrator",
        },
      }
    });

    if (!data) {
      return { error: "No role found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const createRole = async (name: string) => {
  const { user } = await getUserFromCookies();
  try {
    const role = await db.role.create({
      data: {
        name,
      },
    });

    const loginTime = formatTimeStamp(new Date());

    if (role) {
      await db.logs.create({
        data: {
          action: `${user?.name} added ${role.name} on ${loginTime}`,
          branchId: user?.branchId || "",
          userId: user?.id || "",
        },
      });
    }

    revalidatePath("/");
    return { success: "Role created successfully", role };
  } catch (error: any) {
    return {
      error: `Failed to create role. Please try again. ${
        error.message || ""
      }`,
    };
  }
};
