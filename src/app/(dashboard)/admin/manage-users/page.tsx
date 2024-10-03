import { getAllUsers } from "@/actions/user";
import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import UserClient from "./_components/client";
import AddUser from "./_components/add-user";

const ManageUser = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["users"],
    queryFn: getAllUsers,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <Heading
          title="Manage Users"
          description="Manage and oversee the users and staff of our system, categorized by different roles."
        />
        <AddUser />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <UserClient />
      </HydrationBoundary>
    </div>
  );
};

export default ManageUser;
