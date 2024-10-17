/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  ActionEventArgs,
  Day,
  EventSettingsModel,
  Inject,
  Month,
  ScheduleComponent,
  ViewDirective,
  ViewsDirective,
  Week,
} from "@syncfusion/ej2-react-schedule";
import { registerLicense } from "@syncfusion/ej2-base";

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NDaF5cWWtCf1JpRGZGfV5ycEVOal5ZTndWUj0eQnxTdEFiWX5YcnRXTmVZVkN0Vw=="
);

interface ScheduleEvent {
  Id: number;
  Subject: string;
  StartTime: Date;
  EndTime: Date;
  IsAllDay: boolean;
  Status?: string;
  Priority?: string;
}

const AppointmentClient = () => {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem("scheduleEvents");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents) as ScheduleEvent[]);
    }
  }, []);

  const saveEventsToLocalStorage = (updatedEvents: ScheduleEvent[]) => {
    localStorage.setItem("scheduleEvents", JSON.stringify(updatedEvents));
  };

  const onActionComplete = (args: ActionEventArgs): void => {
    let updatedEvents: ScheduleEvent[] = [];

    if (args.requestType === "eventCreated") {
      updatedEvents = [...events, ...(args.addedRecords as ScheduleEvent[])];
    } else if (args.requestType === "eventChanged") {
      updatedEvents = events.map((event) =>
        event.Id === (args.changedRecords?.[0] as ScheduleEvent).Id
          ? (args.changedRecords?.[0] as ScheduleEvent)
          : event
      );
    } else if (args.requestType === "eventRemoved") {
      updatedEvents = events.filter(
        (event) => event.Id !== (args.deletedRecords?.[0] as ScheduleEvent).Id
      );
    }

    setEvents(updatedEvents);
    saveEventsToLocalStorage(updatedEvents); // Save updated events to localStorage
  };

  const eventSettings: EventSettingsModel = {
    dataSource: events,
  };

  return (
    <div className="flex justify-center items-center">
      <ScheduleComponent
        height="700"
        currentView="Month"
        actionComplete={onActionComplete}
        eventSettings={eventSettings}
        selectedDate={new Date()}
      >
        <ViewsDirective>
          <ViewDirective option="Day" />
          <ViewDirective option="Week" />
          <ViewDirective option="Month" />
        </ViewsDirective>
        <Inject services={[Day, Week, Month]} />
      </ScheduleComponent>
    </div>
  );
};

export default AppointmentClient;
