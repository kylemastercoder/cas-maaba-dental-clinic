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
  IconReport,
  IconUsers,
  IconUserSquareRounded,
} from "@tabler/icons-react";
import Image from "next/image";
import BranchSwitcher from "./globals/branch-switcher";
import { Branch, Role, User } from "@prisma/client";
import { getAllBranches } from "@/actions/branch";
import { toast } from "sonner";
import { useParams } from "next/navigation";

interface UserRole extends User {
  role: Role | null;
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user: UserRole | null;
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const [branchData, setBranchData] = React.useState<Branch[]>([]);
  const params = useParams();

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
      {
        title: "Inventory Report",
        url: "/admin/inventory-report",
        icon: IconReport,
      },
    ],
  };

  const branchDataBar = {
    navMain: [
      {
        title: "Dashboard",
        url: `/${params.branchId}`,
        icon: IconBrandTabler,
      },
      {
        title: "Patients",
        url: `/${params.branchId}/patients`,
        icon: IconUserSquareRounded,
      },
      {
        title: "Appointments",
        url: `/${params.branchId}/appointments`,
        icon: IconCalendarMonth,
      },
      {
        title: "Services",
        url: `/${params.branchId}/services`,
        icon: IconFiles,
      },
      {
        title: "Supplies",
        url: `/${params.branchId}/supplies`,
        icon: IconMedicineSyrup,
      },
      {
        title: "Manage Users",
        url: `/${params.branchId}/manage-users`,
        icon: IconUsers,
      },
      {
        title: "Logs",
        url: `/${params.branchId}/logs`,
        icon: IconLogs,
      },
    ],
  };

  const frontDeskDataBar = {
    navMain: [
      {
        title: "Dashboard",
        url: `/${params.branchId}`,
        icon: IconBrandTabler,
      },
      {
        title: "Patients",
        url: `/${params.branchId}/patients`,
        icon: IconUserSquareRounded,
      },
      {
        title: "Appointments",
        url: `/${params.branchId}/appointments`,
        icon: IconCalendarMonth,
      },
      {
        title: "Services",
        url: `/${params.branchId}/services`,
        icon: IconFiles,
      },
      {
        title: "Supplies",
        url: `/${params.branchId}/supplies`,
        icon: IconMedicineSyrup,
      },
      {
        title: "Logs",
        url: `/${params.branchId}/logs`,
        icon: IconLogs,
      },
    ],
  };

  const dentistDataBar = {
    navMain: [
      {
        title: "Dashboard",
        url: `/${params.branchId}`,
        icon: IconBrandTabler,
      },
      {
        title: "Patients",
        url: `/${params.branchId}/patients`,
        icon: IconUserSquareRounded,
      },
      {
        title: "Appointments",
        url: `/${params.branchId}/appointments`,
        icon: IconCalendarMonth,
      },
      {
        title: "Logs",
        url: `/${params.branchId}/logs`,
        icon: IconLogs,
      },
    ],
  };

  const navItems =
    user?.role?.name === "Administrator" && !params.branchId
      ? data.navMain
      : user?.role?.name === "Dentist"
      ? dentistDataBar.navMain
      : user?.role?.name === "Front Desk"
      ? frontDeskDataBar.navMain
      : branchDataBar.navMain;

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a
                href={`${
                  user?.role?.name === "Administrator" && !params.branchId
                    ? "/admin"
                    : `/${params.branchId}`
                }`}
              >
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
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        {user?.role?.name === "Administrator" && (
          <BranchSwitcher items={branchData} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
