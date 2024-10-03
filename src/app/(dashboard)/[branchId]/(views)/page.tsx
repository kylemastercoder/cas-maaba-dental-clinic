import db from "@/lib/db";
import React from "react";

const DashboardPage = async ({ params }: { params: { branchId: string } }) => {
  const branch = await db.branch.findFirst({
    where: {
      id: params.branchId,
    },
  });
  return <div>Active Branch: {branch?.name}</div>;
};

export default DashboardPage;
