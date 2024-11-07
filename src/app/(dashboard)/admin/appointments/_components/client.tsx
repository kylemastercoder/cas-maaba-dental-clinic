/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AppointmentClient = () => {
  return (
    <div className="mt-3">
      <Tabs defaultValue="dasma">
        <TabsList>
          <TabsTrigger value="dasma">Dasmarinas</TabsTrigger>
          <TabsTrigger value="molino">Molino-Bacoor</TabsTrigger>
        </TabsList>
        <TabsContent value="dasma">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=casmaabadental%40gmail.com&amp;ctz=Asia%2FManila"
            width="100%"
            height="1000"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </TabsContent>
        <TabsContent value="molino">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=casmaabadentalservices%40gmail.com&ctz=Asia%2FManila"
            width="100%"
            height="1000"
            frameBorder="0"
            scrolling="no"
          ></iframe>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentClient;
