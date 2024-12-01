"use client";

import { useParams, usePathname } from "next/navigation";
import React from "react";
import UserProfile from "./user-profile";
import CustomBreadcrumb from "./custom-breadcrumb";
import { Branch, Role, User } from "@prisma/client";

import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";
import { NavMain } from "../nav-main";
import { getAllBranches } from "@/actions/branch";
import { toast } from "sonner";
import {
  IconBrandTabler,
  IconCalendarMonth,
  IconFiles,
  IconLogs,
  IconMedicineSyrup,
  IconUsers,
  IconUserSquareRounded,
} from "@tabler/icons-react";
import BranchSwitcher from "./branch-switcher";

interface HeaderProps extends User {
  branch: Branch | null;
  role: Role | null;
}

const Header = ({ user }: { user: HeaderProps | null }) => {
  const { theme, setTheme } = useTheme();

  // Handle toggle change
  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };
  const params = useParams();
  const pathname = usePathname();

  const getHeaderText = () => {
    switch (pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/patients":
        return <CustomBreadcrumb page="Patients" />;
      case "/admin/patients/new":
        return <CustomBreadcrumb page="Patients" />;
      case "/admin/manage-users":
        return <CustomBreadcrumb page="Manage Users" />;
      case "/admin/services":
        return <CustomBreadcrumb page="Services" />;
      case "/admin/services/new":
        return <CustomBreadcrumb page="Services" />;
      case "/admin/appointments":
        return <CustomBreadcrumb page="Appointments" />;
      case "/admin/supplies":
        return <CustomBreadcrumb page="Supplies" />;
      case `/admin/patients/${params.patientId}/treatment-plan`:
        return (
          <CustomBreadcrumb
            subPage="Treatment Plan"
            page="Patients"
            subLink="/admin/patients"
          />
        );
      case "/admin/logs":
        return <CustomBreadcrumb page="Logs" />;
      default:
        return "";
    }
  };

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
    ],
  };

  return (
    <div className="flex no-print items-center justify-between py-5 border-b px-5">
      <div className="md:block hidden">
        {user?.role?.name === "Administrator"
          ? getHeaderText()
          : `${user?.branch?.name}`}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <Switch
            id="dark-mode"
            checked={theme === "light"}
            onCheckedChange={handleToggle}
          />
          <Label htmlFor="dark-mode">
            {theme === "light" ? "Dark" : "Light"} Mode
          </Label>
        </div>
        <div className="flex items-center">
          <UserProfile user={user} />
          <Sheet>
            <SheetTrigger className="md:hidden block">
              <Menu className="md:hidden block" />
            </SheetTrigger>
            <SheetContent>
              <a
                className="flex items-center space-x-2"
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
              <NavMain
                items={
                  user?.role?.name === "Administrator" && !params.branchId
                    ? data.navMain
                    : user?.role?.name === "Dentist"
                    ? dentistDataBar.navMain
                    : branchDataBar.navMain
                }
              />
              {user?.role?.name === "Administrator" && (
                <BranchSwitcher items={branchData} />
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Header;
