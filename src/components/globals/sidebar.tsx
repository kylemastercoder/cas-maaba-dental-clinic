"use client";
import React, { useEffect, useState } from "react";
import {
  SidebarAnimated,
  SidebarBody,
  SidebarLink,
} from "@/components/aceternity-ui/sidebar-animated";
import {
  IconBrandTabler,
  IconCalendarMonth,
  IconFiles,
  IconLogs,
  IconMedicineSyrup,
  IconUsers,
  IconUserSquareRounded,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import BranchSwitcher from "./branch-switcher";
import { Branch } from "@prisma/client";
import { getAllBranches } from "@/actions/branch";
import { toast } from "sonner";

export function Sidebar() {
  const [branchData, setBranchData] = useState<Branch[]>([]);

  useEffect(() => {
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

  const links = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Patients",
      href: "/admin/patients",
      icon: (
        <IconUserSquareRounded className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Services",
      href: "/admin/services",
      icon: (
        <IconFiles className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Appointments",
      href: "/admin/appointments",
      icon: (
        <IconCalendarMonth className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Supplies",
      href: "/admin/supplies",
      icon: (
        <IconMedicineSyrup className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Manage Users",
      href: "/admin/manage-users",
      icon: (
        <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Logs",
      href: "/admin/logs",
      icon: (
        <IconLogs className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <SidebarAnimated open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10 bg-[#f9fafb] border-r">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>
        <div>
          {/* <SidebarLink
            link={{
              label: "Manu Arora",
              href: "#",
              icon: (
                <Image
                  src="/images/logo.png"
                  className="h-7 w-7 flex-shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          /> */}
          <BranchSwitcher items={branchData} isOpen={open} />
        </div>
      </SidebarBody>
    </SidebarAnimated>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/admin"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src="/images/logo-icon.png" alt="Logo" width={60} height={60} />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        CAS-MAABA Dental Clinic
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/admin"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src="/images/logo-icon.png" alt="Logo" width={60} height={60} />
    </Link>
  );
};
