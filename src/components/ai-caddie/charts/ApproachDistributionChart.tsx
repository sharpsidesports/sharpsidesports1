import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useApproachDistributionData } from '../hooks/useApproachDistributionData';

export default function ApproachDistributionChart() {
  const { approachDistributionData } = useApproachDistributionData();
  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];

  const data = approachDistributionData.map(metric => ({
    name: metric.name.replace('Proximity ', ''),  // Simplify labels
    percentage: metric.percentage
  }));

  return (
    <div className="w-full aspect-square max-h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="percentage"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 