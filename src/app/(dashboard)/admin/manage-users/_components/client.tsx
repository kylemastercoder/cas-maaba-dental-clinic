"use client";

import { DataTable } from "@/components/ui/data-table";
import { useGetUsers } from "@/data/user";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, UserColumn } from "./column";
import { format } from "date-fns";

const UserClient = () => {
  const { data: userData, error, isLoading } = useGetUsers();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: UserColumn[] =
    userData?.data?.map((item) => ({
      id: item.id,
      name: item.name,
      username: item.username,
      role: item.role,
      createdAt: format(item.createdAt, "MMMM do, yyyy"),
    })) || [];

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <DataTable
        loading={isLoading}
        searchKey="name"
        columns={columns}
        data={formattedData}
      />
    </>
  );
};

export default UserClient;
