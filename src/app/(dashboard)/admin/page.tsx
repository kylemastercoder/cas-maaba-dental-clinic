/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgeSexBar } from "@/components/globals/age-sex-bar";
import PatientDayTable from "@/components/globals/patient-day-table";
import { PatientLocation } from "@/components/globals/patient-location-pie";
import StatCard from "@/components/globals/stat-card";
import SupplyInventoryTable from "@/components/globals/supply-inventory-table";
import { TreatmentRenderedPie } from "@/components/globals/treatment-rendered-pie";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import db from "@/lib/db";
import { differenceInYears, formatDate } from "date-fns";
import { FileCheck2, Stethoscope, Syringe, Users } from "lucide-react";
import React from "react";

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

const AdminPage = async () => {
  const patient = await db.patient.findMany();
  const supplies = await db.supplies.findMany({
    include: { branch: true },
  });
  const services = await db.service.findMany();
  const treatmentRendered = await db.treatmentPlan.findMany({
    include: { service: true },
  });
  const staff = await db.user.findMany({
    where: { role: { isNot: { name: "Administrator" } } },
  });
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
  const treatmentGroups = treatmentRendered
    .map((item) => item.service?.name)
    .filter((name): name is string => !!name);
  const treatmentDistribution =
    getTreatmentRenderedDistribution(treatmentGroups);
  const locationDistribution = getLocationDistribution(barangays);

  return (
    <div>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-6 mt-5">
        <StatCard
          title="Patients"
          href="/admin/patients"
          description={patient.length}
          icon={Users}
        />
        <StatCard
          title="Services"
          href="/admin/services"
          description={services.length}
          icon={FileCheck2}
        />
        <StatCard
          title="Supplies"
          href="/admin/supplies"
          description={supplies.length}
          icon={Syringe}
        />
        <StatCard
          title="Staff"
          href="/admin/manage-users"
          description={staff.length}
          icon={Stethoscope}
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
            <PatientDayTable userRole={"Administrator"} />
          </CardContent>
        </Card>
      </div>
      <div className="mt-6 grid h-auto md:grid-cols-10 grid-cols-1 gap-6">
        <div className="col-span-4">
          <PatientLocation data={locationDistribution} />
          <div className="mt-6">
            <SupplyInventoryTable userRole={"Administrator"} data={runningSupplies} />
          </div>
        </div>
        <div className="col-span-6">
          <AgeSexBar data={ageSexDistribution} />
          <div className="mt-6">
            <TreatmentRenderedPie data={treatmentDistribution} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
