import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, PieLabelRenderProps } from 'recharts';
import { useStrokesGainedData } from '../hooks/useStrokesGainedData.js';

export default function StrokesGainedChart() {
  const { strokesGainedData } = useStrokesGainedData();
  const COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'];

  // Custom label component to ensure all pie labels are dark green and spaced out
  const DarkGreenLabel = (props: PieLabelRenderProps) => {
    const { cx, cy, midAngle, outerRadius, name, percent = 0 } = props;
    // Ensure cx, cy, and outerRadius are numbers
    const cxNum = typeof cx === 'number' ? cx : parseFloat(cx || '0');
    const cyNum = typeof cy === 'number' ? cy : parseFloat(cy || '0');
    const outerRadiusNum = typeof outerRadius === 'number' ? outerRadius : parseFloat(outerRadius || '0');
    const RADIAN = Math.PI / 180;
    const radius = outerRadiusNum + 60; // 60px outside the pie
    const x = cxNum + radius * Math.cos(-midAngle * RADIAN);
    const y = cyNum + radius * Math.sin(-midAngle * RADIAN);
    return (
      <text
        x={x}
        y={y}
        fill="#006400"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
      >
        {`${name} (${(percent * 100).toFixed(1)}%)`}
      </text>
    );
  };

  return (
    <div className="w-full aspect-square max-h-[400px] pb-12">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={strokesGainedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={DarkGreenLabel}
            outerRadius="80%"
            fill="#8884d8"
            dataKey="percentage"
          >
            {strokesGainedData.map((entry, index) => (
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
          <Legend
            content={({ payload = [] }) => (
              <ul style={{
                listStyle: 'none',
                margin: '40px 0 0 0',
                padding: 0,
                display: 'flex',
                flexWrap: 'wrap',
                gap: '18px 32px',
                alignItems: 'center',
              }}>
                {payload.map((entry, index) => (
                  <li
                    key={`item-${index}`}
                    style={{
                      color: '#006400',
                      fontWeight: 600,
                      fontSize: 16,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: 14,
                        height: 14,
                        backgroundColor: '#006400',
                        marginRight: 8,
                        borderRadius: '50%',
                      }}
                    />
                    {entry.value}
                  </li>
                ))}
              </ul>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}