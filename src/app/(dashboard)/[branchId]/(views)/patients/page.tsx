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
import { getUserFromCookies } from "@/hooks/use-user";

const Patients = async ({ params }: { params: { branchId: string } }) => {
  const { user } = await getUserFromCookies();
  const queryClient = new QueryClient();

  // Prefetch the data from the server
  await queryClient.prefetchQuery({
    queryKey: ["patients"],
    queryFn: getAllPatients,
  });

  // Hydrate the query data for the client
  const dehydratedState = dehydrate(queryClient);
  return (
    <div className="md:grid items-start gap-4 md:gap-8">
      <div className="flex md:flex-row flex-col md:items-center items-start md:justify-between gap-3">
        <Heading
          title="Patient Records"
          description="Manage and view all patient information, including personal details, medical history, and appointments."
        />
        {user?.role.name === "Administrator" ||
          (user?.role.name === "Branch Head" && (
            <Button asChild>
              <Link href={`/${params.branchId}/patients/new`}>Add Patient</Link>
            </Button>
          ))}
      </div>
      <HydrationBoundary state={dehydratedState}>
        {user && <PatientClient user={user} />}
      </HydrationBoundary>
    </div>
  );
};

export default Patients;
