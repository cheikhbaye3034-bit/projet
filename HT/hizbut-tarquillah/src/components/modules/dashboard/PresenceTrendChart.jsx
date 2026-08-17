import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { ASSIDUITE_TREND_DATA } from '../../../mock/mockData';

export const PresenceTrendChart = () => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={ASSIDUITE_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="presenceGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1F6B4B" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#1F6B4B" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="seance"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#66796E', fontSize: 11 }}
          />
          <YAxis
            domain={[60, 100]}
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
              boxShadow: '0 4px 20px -2px rgba(31, 107, 75, 0.08)',
              fontSize: '12px'
            }}
            formatter={(value) => [`${value}%`, 'Taux de présence']}
          />
          <Area
            type="monotone"
            dataKey="taux"
            stroke="#1F6B4B"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#presenceGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
