
import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { getAllLogs } from "@/actions/logs";
import LogsClient from "./_components/client";

const Logs = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["logs"],
    queryFn: getAllLogs,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <Heading
          title="All Logs"
          description="View all logs of the system created by the users."
        />
      </div>
      <HydrationBoundary state={dehydratedState}>
        <LogsClient />
      </HydrationBoundary>
    </div>
  );
};

export default Logs;
