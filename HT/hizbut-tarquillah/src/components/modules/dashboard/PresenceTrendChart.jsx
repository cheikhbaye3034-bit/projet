import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useApp } from '../../../context/AppContext';

export const PresenceTrendChart = ({ data }) => {
  const { seances } = useApp();

  const chartData = data || (seances && seances.length > 0
    ? seances.slice(0, 8).reverse().map((s, idx) => {
        const pres = (s.presences || []).filter(p => p.statut === 'Présent' || p.statut === 'En retard').length;
        const tot = (s.presences || []).length;
        return {
          seance: s.date ? `S${idx + 1}` : `S${idx + 1}`,
          taux: tot > 0 ? Math.round((pres / tot) * 100) : 0
        };
      })
    : []
  );

  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 text-xs bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <span className="font-semibold text-slate-500">Aucune donnée de présence disponible</span>
        <span className="text-[11px] text-slate-400 mt-1">Enregistrez des séances pour visualiser la courbe d'évolution</span>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
