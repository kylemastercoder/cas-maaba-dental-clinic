"use client";

import {
  fetchCalendarEventsToday,
  fetchCalendarEventsTomorrow,
} from "@/actions/appointments";
import React, { useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
}

export type AppointmentColumn = {
  name: string;
  service: string;
  status: string;
  createdAt: string;
};

const columns: ColumnDef<AppointmentColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className="capitalize">{row.original.status}</Badge>
    ),
  },
  {
    accessorKey: "service",
    header: "Service",
  },
  {
    accessorKey: "createdAt",
    header: "Date Added",
  },
];

const PatientDayTable = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [eventsToday, setEventsToday] = useState<CalendarEvent[]>([]);
  const [eventsTomorrow, setEventsTomorrow] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    const getEventsToday = async () => {
      try {
        setIsLoading(true);
        const calendarEvents = await fetchCalendarEventsToday();
        setEventsToday(calendarEvents);
      } catch (error) {
        console.error("Error fetching calendar events today:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const getEventsTomorrow = async () => {
      try {
        setIsLoading(true);
        const calendarEvents = await fetchCalendarEventsTomorrow();
        setEventsTomorrow(calendarEvents);
      } catch (error) {
        console.error("Error fetching calendar events tomorrow:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getEventsToday();
    getEventsTomorrow();
  }, []);

  const formattedDataToday: AppointmentColumn[] =
    eventsToday?.map((item) => ({
      name: item.summary,
      service: item.description || "N/A",
      status: item.status,
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
    })) || [];

  const formattedDataTomorrow: AppointmentColumn[] =
    eventsTomorrow?.map((item) => ({
      name: item.summary,
      service: item.description || "N/A",
      status: item.status,
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
    })) || [];

  return (
    <Tabs defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Today</TabsTrigger>
        <TabsTrigger value="password">Tomorrow</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <DataTable
          loading={isLoading}
          searchKey="name"
          columns={columns}
          data={formattedDataToday}
        />
      </TabsContent>
      <TabsContent value="password">
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
