/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Branch } from "@prisma/client";
import React from "react";

const AppointmentClient = ({ branch }: { branch: Branch }) => {
  const strippedGmail = branch?.gmail
    ? branch.gmail.replace("@gmail.com", "")
    : "";
  return (
    <div className="mt-3">
      <iframe
        src={`https://calendar.google.com/calendar/embed?src=${strippedGmail}%40gmail.com&amp;ctz=Asia%2FManila`}
        width="100%"
        height="1000"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
};

export default AppointmentClient;
