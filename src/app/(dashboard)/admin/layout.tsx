import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/globals/header";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserFromCookies } from "@/hooks/use-user";
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await getUserFromCookies();
  if (user?.role !== "Administrator") {
    redirect("/");
  }
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header user={user} />
        <div className="px-5 py-3">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
