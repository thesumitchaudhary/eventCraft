import React from "react";
import { PieChart, Pie, Sector } from "recharts";
import { RechartsDevtools } from "@recharts/devtools";

// Data exactly like image
const data = [
  { name: "Pending", value: 1 },
  { name: "In Progress", value: 1 },
  { name: "Completed", value: 1 },
];

// Colors matching image
const colors = ["#9AA7B8", "#3B82F6", "#10B981"];

// Custom slice
const CustomSector = (props) => (
  <Sector {...props} fill={colors[props.index]} />
);

// Custom OUTSIDE label
const renderLabel = ({ cx, cy, midAngle, outerRadius, index, name, value }) => {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 35;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill={colors[index]}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={14}
    >
      {name}: {value}
    </text>
  );
};

export default function CellPie({ isAnimationActive = true }) {
  return (
    <PieChart width={400} height={400}>
      <Pie
        data={data}
        dataKey="value"
        cx="50%"
        cy="50%"
        outerRadius={120}
        isAnimationActive={isAnimationActive}
        shape={CustomSector}
        label={renderLabel}
        labelLine={false}
      />
      <RechartsDevtools />
    </PieChart>
  );
}
