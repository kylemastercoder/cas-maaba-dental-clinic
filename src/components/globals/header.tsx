"use client";

import { usePathname } from "next/navigation";
import React from "react";
import Notification from "./notification";
import UserProfile from "./user-profile";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "../ui/input";
import CustomBreadcrumb from "./custom-breadcrumb";

const Header = () => {
  const pathname = usePathname();

  const getHeaderText = () => {
    switch (pathname) {
      case "/admin":
        return "Dashboard";
      case "/admin/patients":
        return <CustomBreadcrumb page="Patients" />;
      case "/admin/manage-users":
        return <CustomBreadcrumb page="Manage Users" />;
      default:
        return "";
    }
  };

  return (
    <div className="flex items-center justify-between py-5 border-b px-5">
      <div>{getHeaderText()}</div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1 mr-3 md:grow-0">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
          />
        </div>
        <Notification />
        <UserProfile />
      </div>
    </div>
  );
};

export default Header;
