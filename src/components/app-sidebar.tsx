"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  IconBrandTabler,
  IconCalendarMonth,
  IconFiles,
  IconLogs,
  IconMedicineSyrup,
  IconUsers,
  IconUserSquareRounded,
} from "@tabler/icons-react";
import Image from "next/image";
import BranchSwitcher from "./globals/branch-switcher";
import { Branch } from "@prisma/client";
import { getAllBranches } from "@/actions/branch";
import { toast } from "sonner";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconBrandTabler,
    },
    {
      title: "Patients",
      url: "/admin/patients",
      icon: IconUserSquareRounded,
    },
    {
      title: "Services",
      url: "/admin/services",
      icon: IconFiles,
    },
    {
      title: "Appointments",
      url: "/admin/appointments",
      icon: IconCalendarMonth,
    },
    {
      title: "Supplies",
      url: "/admin/supplies",
      icon: IconMedicineSyrup,
    },
    {
      title: "Manage Users",
      url: "/admin/manage-users",
      icon: IconUsers,
    },
    {
      title: "Logs",
      url: "/admin/logs",
      icon: IconLogs,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [branchData, setBranchData] = React.useState<Branch[]>([]);

  React.useEffect(() => {
    const fetchBranch = async () => {
      const response = await getAllBranches();
      if (response.error) {
        toast.error(response.error);
      } else {
        if (response.data) {
          setBranchData(response.data);
        }
      }
    };

    fetchBranch();
  }, []);
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <Image
                  src="/images/logo-icon.png"
                  alt="Logo"
                  width={60}
                  height={60}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">CAS-MAABA</span>
                  <span className="truncate text-xs">Dental Clinic</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <BranchSwitcher items={branchData} />
      </SidebarFooter>
    </Sidebar>
  );
}
