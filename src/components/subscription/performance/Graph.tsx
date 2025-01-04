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
import { PerformanceDataPoint } from './data';

interface GraphProps {
  data: PerformanceDataPoint[];
}

export default function Graph({ data }: GraphProps) {
  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
          <XAxis 
            dataKey="date" 
            stroke="#718096"
            tick={{ fill: '#718096' }}
            interval={3}
          />
          <YAxis 
            stroke="#718096"
            tick={{ fill: '#718096' }}
            domain={[0, 'dataMax + 500']}
            tickFormatter={(value) => `${value}u`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A202C',
              border: 'none',
              borderRadius: '0.5rem',
              color: '#CBD5E0'
            }}
            formatter={(value: number) => [`${value.toFixed(2)}u`, 'Value']}
            labelFormatter={(label) => `${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#3CB371"
            strokeWidth={2}
            dot={false}
            animationDuration={2000}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}