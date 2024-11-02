import { redirect } from "next/navigation";
import React from "react";
import db from "@/lib/db";
import { getUserFromCookies } from "@/hooks/use-user";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/globals/header";

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { branchId: string };
}) => {
  const { authToken, user, userId } = await getUserFromCookies();

  // Check if user is authenticated
  if (!authToken) {
    redirect("/sign-in");
  }

  // If the user is an Administrator, allow access to all branches
  if (user.role === "Administrator") {
    const branch = await db.branch.findFirst({
      where: {
        id: params.branchId, // Allow any branch access for admin
      },
    });

    // If branch is not found, redirect to homepage
    if (!branch) {
      redirect("/");
    }
  } else {
    // For other roles (like branch heads), only allow access to their specific branch
    const branch = await db.branch.findFirst({
      where: {
        id: params.branchId,
        user: {
          some: {
            id: userId, // Must match userId for non-admins
          },
        },
      },
    });

    // If branch is not found, redirect to homepage
    if (!branch) {
      redirect("/");
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <Header user={user} />
        <div className="px-5 py-3">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
