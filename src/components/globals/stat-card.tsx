import React from "react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import { type LucideIcon } from "lucide-react";

const StatCard = ({
  title,
  description,
  href,
  icon
}: {
  title: string;
  description: string;
  href?: string;
  icon: LucideIcon;
}) => {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">{title}</p>
          {React.createElement(icon)}
        </div>
        <p className="text-4xl font-bold mt-2">{description}</p>
        {href && (
          <Link className="hover:underline font-semibold text-sm" href={href}>
            View All &rarr;
          </Link>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
