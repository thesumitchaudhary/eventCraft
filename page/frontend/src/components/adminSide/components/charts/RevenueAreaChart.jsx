import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { useQuery } from "@tanstack/react-query";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.message || "Request Failed");
  }

  return body;
};

export default function RevenueAreaChart() {
  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ["showbookings"],
    queryFn: () =>
      fetcher("http://localhost:4041/api/admin/showBookedEvent"),
  });

  // Transform API data to group revenue by month
  const chartData = React.useMemo(() => {
    if (!apiData?.customers) return [];

    const revenueByMonth = {};

    apiData.customers.forEach((customer) => {
      if (Array.isArray(customer?.events)) {
        customer.events.forEach((event) => {
          // Calculate event total
          const eventTotal = Array.isArray(event?.totalAmount)
            ? event.totalAmount.reduce((sum, amount) => sum + (amount || 0), 0)
            : event?.totalAmount || 0;

          // Get month from event date
          const eventDate = new Date(event?.createdAt || event?.date || new Date());
          const monthKey = eventDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
          });

          // Accumulate revenue by month
          revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + eventTotal;
        });
      }
    });

    // Convert to array and sort by date
    return Object.entries(revenueByMonth)
      .map(([month, revenue]) => ({ month, revenue }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [apiData]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <AreaChart
      width={900}
      height={320}
      data={chartData}
      margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
    >
      {/* Gradient definition */}
      <defs>
        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
        </linearGradient>
      </defs>

      <CartesianGrid strokeDasharray="4 4" vertical={false} />

      <XAxis dataKey="month" />
      <YAxis />

      <Tooltip />
      <Legend />

      <Area
        type="monotone"
        dataKey="revenue"
        stroke="#8b5cf6"
        strokeWidth={2}
        fill="url(#revenueGradient)"
        name="Revenue ($)"
      />

      <RechartsDevtools />
    </AreaChart>
  );
}
