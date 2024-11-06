/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgeSexBar } from "@/components/globals/age-sex-bar";
import { PatientLocation } from "@/components/globals/patient-location-pie";
import StatCard from "@/components/globals/stat-card";
import SupplyInventoryTable from "@/components/globals/supply-inventory-table";
import { getUserFromCookies } from "@/hooks/use-user";
import db from "@/lib/db";
import { FileCheck2, Syringe, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import { differenceInYears, formatDate } from "date-fns";
import PatientDayTable from "@/components/globals/patient-day-table";
import { TreatmentRenderedPie } from "@/components/globals/treatment-rendered-pie";

const calculateAge = (birthdate: string): number => {
  return differenceInYears(new Date(), new Date(birthdate));
};

const ageBrackets = [
  { label: "0-18 years old", min: 0, max: 18 },
  { label: "19-35 years old", min: 19, max: 35 },
  { label: "36-50 years old", min: 36, max: 50 },
  { label: "51+ years old", min: 51, max: 120 },
];

const getAgeSexDistribution = (patients: any) => {
  const distribution = ageBrackets.map((bracket) => ({
    label: bracket.label,
    male: 0,
    female: 0,
    min: bracket.min,
    max: bracket.max,
  }));

  patients.forEach((patient: any) => {
    const age = calculateAge(patient.birthdate);
    const sex = patient.sex?.toLowerCase(); // Assuming sex is "Male" or "Female"

    // Find the corresponding bracket
    const bracket = distribution.find((br) => age >= br.min && age <= br.max);

    if (bracket) {
      if (sex === "male") {
        bracket.male += 1;
      } else if (sex === "female") {
        bracket.female += 1;
      }
    }
  });

  return distribution;
};

const getLocationDistribution = (barangays: string[]) => {
  const locationCounts: { [key: string]: number } = {};

  barangays.forEach((barangay) => {
    if (locationCounts[barangay]) {
      locationCounts[barangay] += 1;
    } else {
      locationCounts[barangay] = 1;
    }
  });

  return Object.entries(locationCounts).map(([label, value]) => ({
    label,
    value,
    date: new Date().toISOString().split("T")[0],
  }));
};

const getTreatmentRenderedDistribution = (services: string[]) => {
  const treatmentCount: { [key: string]: number } = {};

  services.forEach((service) => {
    if (treatmentCount[service]) {
      treatmentCount[service] += 1;
    } else {
      treatmentCount[service] = 1;
    }
  });

  return Object.entries(treatmentCount).map(([label, value]) => ({
    label,
    value,
    date: new Date().toISOString().split("T")[0], // Adding current date as a string in YYYY-MM-DD format
  }));
};

const DashboardPage = async ({ params }: { params: { branchId: string } }) => {
  const { user } = await getUserFromCookies();
  const patient = await db.patient.findMany({
    where: {
      branchId: params.branchId,
    },
    include: {
      treatmentPlan: {
        include: {
          service: true,
        },
      },
    },
  });
  const supplies = await db.supplies.findMany({
    where: {
      branchId: params.branchId,
    },
  });
  const services = await db.service.findMany();
  const runningSupplies = supplies
    .map((supply) => ({
      ...supply,
      remaining: supply.quantity - supply.used,
    }))
    .filter((supply) => supply.remaining <= 10);

  const ageSexDistribution = getAgeSexDistribution(patient);
  const barangays = patient.map((p) => {
    const match = p.address ? p.address.match(/,\s*([A-Za-z\s]+),/) : null;
    return match ? match[1].trim() : "Barangay not found";
  });
  const treatmentGroups = patient
    .map((item) => item.treatmentPlan.map((t) => t.service?.name))
    .flat() // Flatten the resulting array of arrays
    .filter((name): name is string => !!name); // Filter out undefined values
  const treatmentDistribution =
    getTreatmentRenderedDistribution(treatmentGroups);
  const locationDistribution = getLocationDistribution(barangays);
  return (
    <div>
      <div className="grid md:grid-cols-3 grid-cols-1 gap-6 mt-5">
        <StatCard
          title="Patients"
          href={`${
            user?.role.name === "admin"
              ? "/admin/patients"
              : `/${params.branchId}/patients`
          }`}
          description={patient.length}
          icon={Users}
        />
        <StatCard
          title="Services"
          href={`${
            user?.role.name === "admin"
              ? "/admin/services"
              : `/${params.branchId}/services`
          }`}
          description={services.length}
          icon={FileCheck2}
        />
        <StatCard
          title="Supplies"
          href={`${
            user?.role.name === "admin"
              ? "/admin/supplies"
              : `/${params.branchId}/supplies`
          }`}
          description={supplies.length}
          icon={Syringe}
        />
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Todos for Today</CardTitle>
            <CardDescription>
              Today is{" "}
              {formatDate(new Date().toLocaleDateString(), "MMMM dd, yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PatientDayTable />
          </CardContent>
        </Card>
      </div>
      {user?.role.name === "Administrator" ||
      user?.role.name === "Branch Head" ? (
        <div className="mt-6 mb-6 grid h-auto md:grid-cols-10 grid-cols-1 gap-6">
          <div className="col-span-4">
            <PatientLocation data={locationDistribution} />
            <div className="mt-6">
              <SupplyInventoryTable data={runningSupplies} />
            </div>
          </div>
          <div className="col-span-6">
            <AgeSexBar data={ageSexDistribution} />
            <div className="mt-6">
              <TreatmentRenderedPie data={treatmentDistribution} />
            </div>
          </div>
        </div>
      ) : user?.role.name === "Dentist" ? (
        null
      ) : (
        <div className="mt-6 mb-6 grid h-auto grid-cols-1 gap-6">
          <SupplyInventoryTable data={runningSupplies} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
