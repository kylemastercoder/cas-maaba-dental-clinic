/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";
import { UserWithRoles } from "@/app/(dashboard)/[branchId]/(views)/patients/_components/cell-action";

const StatCard = ({
  title,
  description,
  href,
  icon,
  user,
}: {
  title: string;
  description: any;
  href?: string;
  icon: LucideIcon;
  user?: UserWithRoles;
}) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{title}</p>
          {React.createElement(icon)}
        </div>
        <p className="text-4xl font-bold mt-2">{description}</p>
        {href && user?.role.name !== "Front Desk" && (
          <Link className="hover:underline font-semibold text-sm" href={href}>
            View All &rarr;
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
