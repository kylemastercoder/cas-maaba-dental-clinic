import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";

const SetupLayout = async ({ children }: { children: React.ReactNode }) => {
  const { authToken, userId, user } = await getUserFromCookies();

  if (!authToken) {
    redirect("/sign-in");
  }

  if (user?.role == "Administrator") {
    redirect("/admin");
  }

  const branch = await db.branch.findFirst({
    where: {
      userId,
    },
  });

  if (branch) {
    redirect(`/${branch.id}`);
  }
  return <>{children}</>;
};

export default SetupLayout;
