"use client";

import { useParams, usePathname } from "next/navigation";
import React from "react";
import Notification from "./notification";
import UserProfile from "./user-profile";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "../ui/input";
import CustomBreadcrumb from "./custom-breadcrumb";
import { User } from "@prisma/client";

const Header = ({ user }: { user: User | null }) => {
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
      <div className="md:block hidden">{getHeaderText()}</div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 mr-3 md:grow-0">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[320px]"
          />
        </div>
        <Notification />
        <UserProfile user={user} />
      </div>
    </div>
  );
};

export default Header;
