import Header from "@/components/globals/header";
import { Sidebar } from "@/components/globals/sidebar";
import { cn } from "@/lib/utils";
import React from "react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
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

export default DashboardLayout;
