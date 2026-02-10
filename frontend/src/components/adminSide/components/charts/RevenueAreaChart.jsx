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

const data = [
  { month: "Dec 2025", revenue: 26000 },
  { month: "Nov 2025", revenue: 24000 },
  { month: "Oct 2025", revenue: 15000 },
];

export default function RevenueAreaChart() {
  return (
    <AreaChart
      width={900}
      height={320}
      data={data}
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
      <YAxis
        ticks={[0, 6500, 13000, 19500, 26000]}
        domain={[0, 26000]}
      />

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
