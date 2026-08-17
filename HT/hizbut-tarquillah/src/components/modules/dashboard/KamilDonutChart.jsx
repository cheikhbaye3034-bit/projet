import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../../context/AppContext';

export const KamilDonutChart = () => {
  const { kamilCycle } = useApp();

  const termines = kamilCycle.assignations.filter(a => a.statut === 'Terminé').length;
  const enCours = kamilCycle.assignations.filter(a => a.statut === 'En cours').length;
  const aFaire = kamilCycle.assignations.filter(a => a.statut === 'À faire').length;

  const data = [
    { name: 'Terminé', value: termines, color: '#1F6B4B' }, // Emerald Green
    { name: 'En cours', value: enCours, color: '#D97706' }, // Amber Gold
    { name: 'À faire', value: aFaire, color: '#CBD5E1' },  // Slate Gray
  ];

  return (
    <div className="w-full h-56 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E6EFEA',
              fontSize: '12px',
              boxShadow: '0 4px 20px -2px rgba(0,0,0,0.08)'
            }}
            formatter={(value) => [`${value} Juz'`, 'Parties']}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Donut Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-display font-extrabold text-2xl text-ht-ink">
          {termines}/30
        </span>
        <span className="text-[11px] text-ht-inkSoft font-medium">parties</span>
      </div>
    </div>
  );
};
