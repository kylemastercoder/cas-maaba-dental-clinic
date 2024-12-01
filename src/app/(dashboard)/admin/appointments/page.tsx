
import { Heading } from "@/components/ui/heading";
import React from "react";
import AppointmentClient from "./_components/client";
import db from "@/lib/db";

const Appointments = async () => {
  const branches = await db.branch.findMany();
  return (
    <div className="md:grid items-start gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <Heading
          title="Appointments"
          description="Easily schedule and manage your dental appointments online. Our system allows you to book consultations, check-ups, and treatments at your convenience."
        />
      </div>
      <AppointmentClient branches={branches} />
    </div>
  );
};

export default Appointments;
