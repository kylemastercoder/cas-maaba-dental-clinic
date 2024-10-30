import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import AddSupply from "./_components/add-supply";
import SupplyClient from "./_components/client";
import { getAllSupplies } from "@/actions/supply";

const Services = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["supplies"],
    queryFn: getAllSupplies,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="md:grid items-start gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <Heading
          title="Supply Records"
          description="Manage and monitor your medical supplies inventory, including tracking supply levels, adding new items, and keeping records up to date."
        />
        <AddSupply />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <SupplyClient />
      </HydrationBoundary>
    </div>
  );
};

export default Services;
