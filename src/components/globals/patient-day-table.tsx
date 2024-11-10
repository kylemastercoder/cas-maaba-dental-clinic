"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchCalendarEventsToday,
  fetchCalendarEventsTomorrow,
} from "@/actions/appointments";

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  status: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  branch: string;
}

export type AppointmentColumn = {
  name: string;
  service: string;
  status: string;
  branch?: string;
  createdAt: string;
};

const PatientDayTable = ({
  userRole,
  branch,
}: {
  userRole?: string;
  branch?: string;
}) => {
  const columns: ColumnDef<AppointmentColumn>[] = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge className="capitalize">{row.original.status}</Badge>
      ),
    },
    { accessorKey: "service", header: "Service" },
    ...(userRole === "Administrator"
      ? [{ accessorKey: "branch", header: "Branch" }]
      : []),
    { accessorKey: "createdAt", header: "Date & Time" },
  ];

  const [isLoading, setIsLoading] = useState(true);
  const [eventsToday, setEventsToday] = useState<CalendarEvent[]>([]);
  const [eventsTomorrow, setEventsTomorrow] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        let todayEvents = await fetchCalendarEventsToday();
        let tomorrowEvents = await fetchCalendarEventsTomorrow();

        // Filter by branch if user is not an Administrator
        if (userRole !== "Administrator" && branch) {
          todayEvents = todayEvents.filter((event) => event.branch === branch);
          tomorrowEvents = tomorrowEvents.filter(
            (event) => event.branch === branch
          );
        }

        setEventsToday(todayEvents);
        setEventsTomorrow(tomorrowEvents);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [userRole, branch]);

  const formatEvents = (events: CalendarEvent[], includeBranch: boolean) =>
    events.map((item) => ({
      name: item.summary,
      service: item.description || "N/A",
      status: item.status,
      branch: includeBranch ? item.branch : undefined,
      createdAt: `${format(
        item.start.dateTime
          ? new Date(item.start.dateTime)
          : new Date(item.start.date || ""),
        "MMMM dd, yyyy | hh:mm a"
      )} - ${format(
        item.end.dateTime
          ? new Date(item.end.dateTime)
          : new Date(item.end.date || ""),
        "hh:mm a"
      )}`,
    }));

  const formattedDataToday = formatEvents(
    eventsToday,
    userRole === "Administrator"
  );
  const formattedDataTomorrow = formatEvents(
    eventsTomorrow,
    userRole === "Administrator"
  );

  return (
    <Tabs defaultValue="today">
      <TabsList>
        <TabsTrigger value="today">Today</TabsTrigger>
        <TabsTrigger value="tomorrow">Tomorrow</TabsTrigger>
      </TabsList>
      <TabsContent value="today">
        <DataTable
          loading={isLoading}
          searchKey="name"
          columns={columns}
          data={formattedDataToday}
        />
      </TabsContent>
      <TabsContent value="tomorrow">
        <DataTable
          loading={isLoading}
          searchKey="name"
          columns={columns}
          data={formattedDataTomorrow}
        />
      </TabsContent>
    </Tabs>
  );
};

export default PatientDayTable;
