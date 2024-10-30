"use server";

import axios from "axios";

export const fetchCalendarEvents = async () => {
  const today = new Date();
  const timeMin = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const timeMax = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const response = await axios.get(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      process.env.REACT_APP_CALENDAR_ID!
    )}/events?key=${
      process.env.REACT_APP_GOOGLE_API_KEY
    }&timeMin=${timeMin}&timeMax=${timeMax}`
  );

  return response.data.items;
};
