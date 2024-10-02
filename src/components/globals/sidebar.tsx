"use client";
import React, { useState } from "react";
import {
  SidebarAnimated,
  SidebarBody,
  SidebarLink,
} from "@/components/aceternity-ui/sidebar-animated";
import {
  IconBrandTabler,
  IconMedicineSyrup,
  IconStethoscope,
  IconUserSquareRounded,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";

export function Sidebar() {
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Patients",
      href: "/patients",
      icon: (
        <IconUserSquareRounded className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Treatment Rendered",
      href: "/treatment-rendered",
      icon: (
        <IconStethoscope className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Stocks",
      href: "/stocks",
      icon: (
        <IconMedicineSyrup className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
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
      </SidebarBody>
    </SidebarAnimated>
  );
}
export const Logo = () => {
  return (
    <Link
      href="/"
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
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src="/images/logo-icon.png" alt="Logo" width={60} height={60} />
    </Link>
  );
};
