
import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import ServiceClient from "./_components/client";
import { getAllServices } from "@/actions/service";
import AddService from "./_components/add-service";

const Services = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["services"],
    queryFn: getAllServices,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <Heading
          title="Service Records"
          description="Manage and track all your services in one place. View detailed records, add new services, and ensure your service data is always up-to-date with easy-to-use tools."
        />
        <AddService />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <ServiceClient />
      </HydrationBoundary>
    </div>
  );
};

export default Services;
