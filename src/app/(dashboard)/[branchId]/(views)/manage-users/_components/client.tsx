"use client";

import { DataTable } from "@/components/ui/data-table";
import { useGetUsers } from "@/data/user";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, UserColumn } from "./column";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";

const UserClient = () => {
  const { data: userData, error, isLoading } = useGetUsers();
  const [isMounted, setIsMounted] = useState(false);
  const params = useParams();
  const branchId = params.branchId;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An error occurred");
    }
  }, [error]);

  const formattedData: UserColumn[] =
    userData?.data?.filter((item) => (branchId ? item.branchId === branchId : true))
    .map((item) => ({
      id: item.id,
      name: item.name,
      username: item.username,
      role: item.role.name,
      roleId: item.roleId,
      branch: item.branch.name,
      branchId: item.branchId,
      isActive: item.isActive,
      createdAt: format(item.createdAt, "MMMM dd, yyyy"),
    })) || [];

  const nonAdminUser = formattedData.filter((user) => user.role !== "Administrator");
  const activeUsers = nonAdminUser.filter((user) => user.isActive);
  const inactiveUsers = nonAdminUser.filter((user) => !user.isActive);

  if (!isMounted) {
    return null;
  }
  return (
    <Tabs defaultValue="active">
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="inactive">Inactive</TabsTrigger>
      </TabsList>
      <TabsContent value="active">
        <DataTable
          loading={isLoading}
          searchKey="name"
          columns={columns}
          data={activeUsers}
        />
      </TabsContent>
      <TabsContent value="inactive">
        <DataTable
          loading={isLoading}
          searchKey="name"
          columns={columns}
          data={inactiveUsers}
        />
      </TabsContent>
    </Tabs>
  );
};

export default UserClient;
