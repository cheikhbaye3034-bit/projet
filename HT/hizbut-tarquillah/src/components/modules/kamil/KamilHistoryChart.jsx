import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useApp } from '../../../context/AppContext';

export const KamilHistoryChart = () => {
  const { pastKamilCycles } = useApp();

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={pastKamilCycles} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="cycle"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#66796E', fontSize: 11 }}
          />
          <YAxis
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#66796E', fontSize: 11 }}
            unit="%"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E6EFEA',
              fontSize: '12px'
            }}
            formatter={(value, name, item) => [`${value}% (${item.payload.jours} jours)`, 'Taux de complétion']}
          />
          <Bar dataKey="completion" radius={[8, 8, 0, 0]}>
            {pastKamilCycles.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={entry.completion === 100 ? '#1F6B4B' : '#C08A3E'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
