import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { PerformanceDataPoint } from './data.js';

interface GraphProps {
  data: PerformanceDataPoint[];
}

export default function Graph({ data }: GraphProps) {
  const percentageData = data.map(point => ({
    date: point.date,
    value: point.value - 100  // Convert from base 100 to percentage gain
  }));

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart 
          data={percentageData}
          margin={{ top: 10, right: 30, left: 10, bottom: 5 }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#1A202C"
            opacity={0.4}
            horizontal={true}
            vertical={false}
          />
          <XAxis 
            dataKey="date" 
            stroke="#718096"
            tick={{ fill: '#718096', fontSize: 12 }}
            tickFormatter={(value) => {
              const [month, year] = value.split(' ');
              return `${month} '${year.slice(2)}`;
            }}
            axisLine={{ stroke: '#2D3748' }}
            interval={3}
          />
          <YAxis 
            stroke="#718096"
            tick={{ fill: '#718096', fontSize: 12 }}
            domain={[-20, 500]}
            ticks={[0, 100, 200, 300, 400, 476.5]}
            tickFormatter={(value) => `${value}%`}
            axisLine={{ stroke: '#2D3748' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A202C',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#718096',
              fontSize: '12px',
              padding: '8px'
            }}
            formatter={(value: number) => [`${value.toFixed(1)}%`, 'Gain']}
            labelFormatter={(label) => label}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#34D399"
            strokeWidth={2}
            dot={false}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}