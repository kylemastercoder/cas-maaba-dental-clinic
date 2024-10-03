import Header from "@/components/globals/header";
import { Sidebar } from "@/components/globals/sidebar";
import { getUserFromCookies } from "@/hooks/use-user";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await getUserFromCookies();
  if (user?.role !== "Administrator") {
    redirect("/");
  }
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-white flex-1 w-full border overflow-hidden",
        "h-[100vh]"
      )}
    >
      <Sidebar />
      <main className="flex-1">
        <Header />
        <div className="px-5 py-3">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
