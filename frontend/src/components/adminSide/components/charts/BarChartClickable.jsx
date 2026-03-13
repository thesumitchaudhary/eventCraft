import React from "react";
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { useQuery } from "@tanstack/react-query";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  const body = await res.json(); // ✅ await

  if (!res.ok) {
    throw new Error(body?.message || "Request Failed");
  }

  return body;
};

export default function EventsByTypeChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["showbookings"],
    queryFn: () =>
      fetcher("http://localhost:4041/api/admin/showBookedEvent"),
  });

  // ✅ For payload like: { customers: [{ events: [...] }, ...] }
  const rawBookings = Array.isArray(data?.customers)
    ? data.customers.flatMap((customer) =>
        Array.isArray(customer?.events) ? customer.events : []
      )
    : [];

  const chartData = rawBookings.reduce((acc, item) => {
    const type = item?.eventType || "Unknown";
    const existing = acc.find((x) => x.name === type);

    if (existing) existing.bookings += 1;
    else acc.push({ name: type, bookings: 1 });

    return acc;
  }, []);

  if (isLoading) return <p>Loading chart...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;

  return (
    <div className="rounded-xl p-5 w-fit">
      <h2 className="text-lg font-semibold">Events by Type</h2>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of event categories
      </p>

      <BarChart width={550} height={260} data={chartData}>
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="bookings"
          fill="#8b5cf6"
          radius={[6, 6, 0, 0]}
          name="Bookings"
        />
        <RechartsDevtools />
      </BarChart>
    </div>
  );
}
