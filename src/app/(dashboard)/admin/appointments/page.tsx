
import { Heading } from "@/components/ui/heading";
import React from "react";
import AppointmentClient from "./_components/client";

const Appointments = async () => {
  return (
    <div className="grid flex-1 items-start gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <Heading
          title="Appointments"
          description="Easily schedule and manage your dental appointments online. Our system allows you to book consultations, check-ups, and treatments at your convenience."
        />
        {/* <AddUser /> */}
      </div>
      <AppointmentClient />
    </div>
  );
};

export default Appointments;
