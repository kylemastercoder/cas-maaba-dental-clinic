/* eslint-disable @typescript-eslint/no-explicit-any */
import { AgeSexBar } from "@/components/globals/age-sex-bar";
import PatientDayTable from "@/components/globals/patient-day-table";
import StatCard from "@/components/globals/stat-card";
import { SuppliesPie } from "@/components/globals/supplies-pie";
import SupplyInventoryTable from "@/components/globals/supply-inventory-table";
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
    const bracket = distribution.find(
      (br) => age >= br.min && age <= br.max
    );

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

const AdminPage = async () => {
  const patient = await db.patient.findMany();
  const supplies = await db.supplies.findMany();
  const services = await db.service.findMany();
  const staff = await db.user.findMany();
  const runningSupplies = await db.supplies.findMany({
    where: {
      quantity: {
        lte: 10,
      },
    },
  });

  const totalUsed = supplies.reduce((acc, supply) => acc + supply.used, 0);
  const totalRemaining = supplies.reduce((acc, supply) => acc + supply.quantity, 0);
  
  const pieData = [
    { label: "Supplies Used", value: totalUsed, fill: "hsl(var(--chart-5))" },
    { label: "Remaining Supplies", value: totalRemaining, fill: "hsl(var(--chart-3))" },
  ];

  const ageSexDistribution = getAgeSexDistribution(patient);
  
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
      <div className="mt-6 mb-6 grid h-auto md:grid-cols-10 grid-cols-1 gap-6">
        <div className="col-span-4">
          <SuppliesPie data={pieData} />
          <div className="mt-6">
            <SupplyInventoryTable data={runningSupplies} />
          </div>
        </div>
        <div className="col-span-6">
          <AgeSexBar data={ageSexDistribution} />
        </div>
      </div>
      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Appointed Patients for Today</CardTitle>
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
    </div>
  );
};

export default AdminPage;
