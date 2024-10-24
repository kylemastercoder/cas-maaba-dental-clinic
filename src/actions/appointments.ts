"use server";

import axios from "axios";

export const fetchCalendarEvents = async () => {
  const response = await axios.get(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      process.env.REACT_APP_CALENDAR_ID!
    )}/events?key=${process.env.REACT_APP_GOOGLE_API_KEY}`
  );
  return response.data.items;
};
