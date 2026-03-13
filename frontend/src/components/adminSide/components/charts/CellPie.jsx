import React from "react";
import { PieChart, Pie, Sector } from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { useQuery } from "@tanstack/react-query";

const colors = ["#9AA7B8", "#3B82F6", "#10B981"];
const CHART_WIDTH = 520;
const CHART_HEIGHT = 360;

const fetcher = async (url) => {
  const res = await fetch(url, { credentials: "include" });
  const body = await res.json();

  if (!res.ok) {
    throw new Error(body?.message || "Request Failed");
  }

  return body;
};

const CustomSector = (props) => (
  <Sector {...props} fill={colors[props.index % colors.length]} />
);

// Custom OUTSIDE label
const renderLabel = ({ cx, cy, midAngle, outerRadius, index, name, value }) => {
  // ✅ prevent overlapped labels for zero slices
  if (!value) return null;

  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 22; // less push outside
  const rawX = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // ✅ clamp x so text stays inside SVG viewbox
  const minX = 24;
  const maxX = CHART_WIDTH - 24;
  const x = Math.max(minX, Math.min(maxX, rawX));

  return (
    <text
      x={x}
      y={y}
      fill={colors[index % colors.length]}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={14}
    >
      {name}: {value}
    </text>
  );
};

export default function CellPie({ isAnimationActive = true }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["showbookings"],
    queryFn: () =>
      fetcher("http://localhost:4041/api/admin/showBookedEvent"),
  });

  const events = Array.isArray(data?.customers)
    ? data.customers.flatMap((customer) =>
        Array.isArray(customer?.events) ? customer.events : []
      )
    : [];

  const counts = events.reduce(
    (acc, event) => {
      const status = String(event?.bookingStatus || "").toLowerCase();

      if (["pending"].includes(status)) acc.pending += 1;
      else if (["in progress", "processing", "ongoing"].includes(status))
        acc.inProgress += 1;
      else acc.completed += 1;
      return acc;
    },
    { pending: 0, inProgress: 0, completed: 0 }
  );

  const chartData = [
    { name: "Pending", value: counts.pending },
    { name: "In Progress", value: counts.inProgress },
    { name: "Completed", value: counts.completed },
  ];

  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (isLoading) return <p>Loading chart...</p>;
  if (error) return <p className="text-red-500">{error.message}</p>;
  if (total === 0) return <p>No booking status data available.</p>;

  return (
    <PieChart width={CHART_WIDTH} height={CHART_HEIGHT}>
      <Pie
        data={chartData}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={100} // slightly smaller to give label room
        isAnimationActive={isAnimationActive}
        shape={CustomSector}
        label={renderLabel}
        labelLine={false}
      />
      <RechartsDevtools />
    </PieChart>
  );
}
