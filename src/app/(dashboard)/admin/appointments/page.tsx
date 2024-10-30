
import { Heading } from "@/components/ui/heading";
import React from "react";
import AppointmentClient from "./_components/client";

const Appointments = async () => {
  return (
    <div className="md:grid items-start gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <Heading
          title="Appointments"
          description="Easily schedule and manage your dental appointments online. Our system allows you to book consultations, check-ups, and treatments at your convenience."
        />
      </div>
      <AppointmentClient />
    </div>
  );
};

export default Appointments;
