
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import Link from "next/link";
import React from "react";
import PatientClient from "./_components/client";
import { getAllPatients } from "@/actions/patient";

const Patients = async () => {
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <Heading
          title="Patient Records"
          description="Manage and view all patient information, including personal details, medical history, and appointments."
        />
        <Button asChild>
          <Link href={`/admin/patients/new`}>Add Patient</Link>
        </Button>
      </div>
      <HydrationBoundary state={dehydratedState}>
        <PatientClient />
      </HydrationBoundary>
    </div>
  );
};

export default Patients;
