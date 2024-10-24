import { AgeSexBar } from "@/components/globals/age-sex-bar";
import StatCard from "@/components/globals/stat-card";
import { SuppliesPie } from "@/components/globals/supplies-pie";
import { TreatmentBar } from "@/components/globals/treatment-bar";
import db from "@/lib/db";
import { FileCheck2, Stethoscope, Syringe, Users } from "lucide-react";
import React from "react";

const AdminPage = async () => {
  const patient = await db.patient.findMany();
  const supplies = await db.supplies.findMany();
  const services = await db.service.findMany();
  const staff = await db.user.findMany();
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
      <div className="mt-6 mb-6 grid md:grid-cols-10 grid-cols-1 gap-6">
        <div className="col-span-2">
          <SuppliesPie />
        </div>
        <div className="col-span-2">
          <TreatmentBar />
        </div>
        <div className="col-span-6">
          <AgeSexBar />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
