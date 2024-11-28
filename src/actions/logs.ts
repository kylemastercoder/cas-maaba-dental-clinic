"use server";

import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";

export const getAllLogs = async () => {
  try {
    const data = await db.logs.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No logs found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};

export const getAllLogsByUser = async () => {
  const { user } = await getUserFromCookies();
  try {
    const data = await db.logs.findMany({
      where: {
        userId: user?.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!data) {
      return { error: "No logs found." };
    }

    return { data };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong." };
  }
};
