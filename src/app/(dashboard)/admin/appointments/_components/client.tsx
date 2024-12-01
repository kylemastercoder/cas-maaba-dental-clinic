/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Branch } from "@prisma/client";

const AppointmentClient = ({ branches }: { branches: Branch[] }) => {
  return (
    <div className="mt-3">
      <Tabs defaultValue={branches[0].name}>
        <TabsList>
          {branches.map((branch) => (
            <TabsTrigger key={branch.id} value={branch.name}>
              {branch.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {branches.map((branch) => {
          // Remove "@gmail.com" from the email
          const strippedGmail = branch?.gmail
            ? branch.gmail.replace("@gmail.com", "")
            : "";

          return (
            <TabsContent key={branch.id} value={branch.name}>
              <iframe
                src={`https://calendar.google.com/calendar/embed?src=${strippedGmail}%40gmail.com&amp;ctz=Asia%2FManila`}
                width="100%"
                height="1000"
                frameBorder="0"
                scrolling="no"
              ></iframe>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default AppointmentClient;
