/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

const AppointmentClient = ({ branch }: { branch: string }) => {
  return (
    <div className="mt-3">
      {branch === "Cas-Maaba Dasmarinas" ? (
        <iframe
          src="https://calendar.google.com/calendar/embed?src=clybuenaflor12221%40gmail.com&amp;ctz=Asia%2FManila"
          width="100%"
          height="1000"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      ) : (
        <iframe
          src="https://calendar.google.com/calendar/embed?src=casmaabadentalservices%40gmail.com&amp;ctz=Asia%2FManila"
          width="100%"
          height="1000"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      )}
    </div>
  );
};

export default AppointmentClient;
