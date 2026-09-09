import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useApp } from '../../../context/AppContext';

export const KourelAssiduiteChart = () => {
  const { kourels, seances } = useApp();

  const chartData = (kourels || []).map((k) => {
    const kSeances = (seances || []).filter(s => s.kourel_id === k.id);
    let taux = 0;
    if (kSeances.length > 0) {
      let totalPresents = 0;
      let totalEffectif = 0;
      kSeances.forEach(s => {
        const pres = (s.presents_ids || []).length;
        const total = (s.effectif_total || 0) || (pres + (s.absents_ids || []).length);
        totalPresents += pres;
        totalEffectif += total;
      });
      taux = totalEffectif > 0 ? Math.round((totalPresents / totalEffectif) * 100) : 0;
    }

    return {
      name: k.nom ? k.nom.replace(/^Kourel\s+/i, 'K. ') : 'Kourel',
      taux,
      seancesCount: kSeances.length
    };
  });

  const hasData = chartData.some(d => d.seancesCount > 0);

  if (!hasData || chartData.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
        <p className="font-semibold">Aucune séance enregistrée pour les kourels</p>
        <p className="text-[11px] text-slate-400 mt-1">L'assiduité comparative s'affichera dès les premières répétitions.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            formatter={(value, name, item) => [`${value}% (${item.payload.seancesCount} séances)`, 'Assiduité moyenne']}
          />
          <Bar dataKey="taux" radius={[8, 8, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={index === 0 ? '#1F6B4B' : '#3F9270'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
