import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useQuery } from "@tanstack/react-query";

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.message || "Request Failed");
  }

  return body;
};

const RevenueByEventChart = () => {
  const { data: apiData, isLoading, error } = useQuery({
    queryKey: ["showbookings"],
    queryFn: () => fetcher("http://localhost:4041/api/admin/showBookedEvent"),
  });

  const chartData = React.useMemo(() => {
    const customers = apiData?.customers;

    if (!Array.isArray(customers)) return [];

    const revenueByEventType = customers
      .flatMap((customer) => (Array.isArray(customer?.events) ? customer.events : []))
      .reduce((acc, event) => {
        const eventType = event?.eventType || "Unknown";
        const revenue = Number(event?.totalPaid || 0);

        acc[eventType] = (acc[eventType] || 0) + revenue;
        return acc;
      }, {});

    return Object.entries(revenueByEventType).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  }, [apiData]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-gray-500">Loading revenue chart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-red-500">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold">Revenue by Event Type</h2>
      <p className="text-gray-500 mb-4">
        Total revenue generated per event category
      </p>

      <div className="h-100">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="revenue"
              fill="#10b981"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueByEventChart;
