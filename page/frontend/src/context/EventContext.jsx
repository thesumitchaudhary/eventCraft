import React, { useState, createContext } from "react";

export const EventContext = createContext(null);

export const EventProvider = (props) => {
  const [eventName, setEventName] = useState("");
  const [eventType, setEventType] = useState("");
  const [selectTheme, setSelectTheme] = useState("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [budget, setBudget] = useState("");
  return (
    <EventContext.Provider
      value={{
        eventName,
        setEventName,
        eventType,
        setEventType,
        selectTheme,
        setSelectTheme,
        date,
        setDate,
        venue,
        setVenue,
        guestCount,
        setGuestCount,
        budget,
        setBudget,
      }}
    >
      {props.children}
    </EventContext.Provider>
  );
};
