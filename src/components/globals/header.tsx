"use client";

import { useParams, usePathname } from "next/navigation";
import React from "react";
import UserProfile from "./user-profile";
import CustomBreadcrumb from "./custom-breadcrumb";
import { User as PrismaUser } from "@prisma/client";

interface User extends PrismaUser {
  branch: { name: string }[];
}
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useTheme } from "next-themes";

const Header = ({ user }: { user: User | null }) => {
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

  return (
    <div className="flex items-center justify-between py-5 border-b px-5">
      <div className="md:block hidden">{user?.role === "Administrator" && !params.branchId ? getHeaderText() : `${user?.branch[0].name}`}</div>
      <div className="flex items-center gap-2">
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
        <UserProfile user={user} />
      </div>
    </div>
  );
};

export default Header;
