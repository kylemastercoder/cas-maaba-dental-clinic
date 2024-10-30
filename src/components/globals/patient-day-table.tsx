"use client";

import { fetchCalendarEvents } from "@/actions/appointments";
import React, { useEffect, useState } from "react";
import { DataTable } from "../ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";
import { format } from "date-fns";

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
    cell: ({row}) => (
      <Badge className="capitalize">
        {row.original.status}
      </Badge>
    )
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
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsLoading(true);
        const calendarEvents = await fetchCalendarEvents();
        setEvents(calendarEvents);
      } catch (error) {
        console.error("Error fetching calendar events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getEvents();
  }, []);

  const formattedData: AppointmentColumn[] =
    events?.map((item) => ({
      name: item.summary,
      service: item.description || "N/A",
      status: item.status,
      createdAt: `${format(item.start.dateTime ? new Date(item.start.dateTime) : new Date(item.start.date || ""), "MMMM dd, yyyy | hh:mm a")} - ${format(item.end.dateTime ? new Date(item.end.dateTime) : new Date(item.end.date || ""), "hh:mm a")}`,
    })) || [];

  return (
    <DataTable
      loading={isLoading}
      searchKey="name"
      columns={columns}
      data={formattedData}
    />
  );
};

export default PatientDayTable;