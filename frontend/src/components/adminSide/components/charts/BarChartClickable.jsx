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

const data = [
  { name: "Wedding", bookings: 1 },
  { name: "Anniversary", bookings: 1 },
  { name: "Birthday", bookings: 1 },
  { name: "Engagement", bookings: 1 },
];

export default function EventsByTypeChart() {
  return (
    <div className="rounded-xl p-5 w-fit">
      {/* Title */}
      <h2 className="text-lg font-semibold">Events by Type</h2>
      <p className="text-sm text-gray-500 mb-4">
        Distribution of event categories
      </p>

      <BarChart width={550} height={260} data={data}>
        <CartesianGrid strokeDasharray="4 4" />
        <XAxis dataKey="name" />
        <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} />

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
