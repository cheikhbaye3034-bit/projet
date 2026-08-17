import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { KOURELS_COMPARISON_DATA } from '../../../mock/mockData';

export const KourelAssiduiteChart = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={KOURELS_COMPARISON_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <XAxis
            dataKey="name"
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
            formatter={(value) => [`${value}%`, 'Assiduité moyenne']}
          />
          <Bar dataKey="taux" radius={[8, 8, 0, 0]}>
            {KOURELS_COMPARISON_DATA.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={index === 0 ? '#1F6B4B' : '#3F9270'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
