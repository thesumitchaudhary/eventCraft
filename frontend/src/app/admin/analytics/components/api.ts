export type EventItem = {
  eventType?: string;
  bookingStatus?: string;
  totalAmount?: number | number[];
  createdAt?: string;
  date?: string;
};

export type BookingCustomer = {
  events?: EventItem[];
};

export type ShowBookingsResponse = {
  customers?: BookingCustomer[];
  message?: string;
};

export const fetcher = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url, { credentials: "include" });
  const body = (await res.json()) as T & { message?: string };

  if (!res.ok) {
    throw new Error(body?.message || "Request Failed");
  }

  return body as T;
};

export const getBookingEvents = (data?: ShowBookingsResponse): EventItem[] => {
  if (!Array.isArray(data?.customers)) {
    return [];
  }

  return data.customers.flatMap((customer) =>
    Array.isArray(customer?.events) ? customer.events : [],
  );
};
