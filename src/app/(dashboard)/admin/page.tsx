import { AgeSexBar } from "@/components/globals/age-sex-bar";
import StatCard from "@/components/globals/stat-card";
import { SuppliesPie } from "@/components/globals/supplies-pie";
import { TreatmentBar } from "@/components/globals/treatment-bar";
import { FileCheck2, Stethoscope, Syringe, Users } from "lucide-react";
import React from "react";

const AdminPage = () => {
  return (
    <div>
      <div className="grid md:grid-cols-4 grid-cols-1 gap-6 mt-5">
        <StatCard title="Patients" href="/admin/patients" description="5" icon={Users} />
        <StatCard title="Services" href="/admin/services" description="5" icon={FileCheck2} />
        <StatCard title="Supplies" href="/admin/supplies" description="5" icon={Syringe} />
        <StatCard title="Staff" href="/admin/manage-users" description="5" icon={Stethoscope} />
      </div>
      <div className="mt-6 mb-6 grid md:grid-cols-2 grid-cols-1 gap-6">
        <SuppliesPie />
        <TreatmentBar />
      </div>
      <AgeSexBar />
    </div>
  );
};

export default AdminPage;
