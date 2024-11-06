"use client";

import { DataTable } from "@/components/ui/data-table";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { columns, PatientColumn } from "./column";
import { differenceInYears, format } from "date-fns";
import { useGetPatients } from "@/data/patient";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PatientClient = () => {
  const { data: patientData, error, isLoading } = useGetPatients();
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

  const formattedData: PatientColumn[] =
    patientData?.data
      ?.filter((item) => (branchId ? item.branchId === branchId : true))
      .map((item) => ({
        id: item.id,
        name: item.firstName + " " + item.lastName,
        address: item.address ?? "N/A",
        email: item.email ?? "N/A",
        sex: item.sex ?? "N/A",
        isActive: item.isActive,
        age: differenceInYears(new Date(), new Date(item.birthdate)),
        contactNumber: item.contactNumber,
        createdAt: format(item.createdAt, "MMMM dd, yyyy"),
      })) || [];

  const activePatients = formattedData.filter((patient) => patient.isActive);
  const inactivePatients = formattedData.filter((patient) => !patient.isActive);

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
          data={activePatients}
        />
      </TabsContent>
      <TabsContent value="inactive">
        <DataTable
          loading={isLoading}
          searchKey="name"
          columns={columns}
          data={inactivePatients}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PatientClient;
