import React, { useState } from 'react';
import { Calendar, Music, Mic, BookOpen, Volume2, CheckCircle2, Clock, Users, Plus, ChevronRight } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { KhassidasSubView } from './KhassidasSubView';
import { SonsSubView } from './SonsSubView';
import { EnregistrementsSubView } from './EnregistrementsSubView';
import { AudioPlayerCard } from './AudioPlayerCard';
import { PointageTable } from './PointageTable';

export const RepetitionView = () => {
  const { kourels, seances, khassidas, membres } = useApp();

  // Active sub-section state: 'khassidas' | 'sons' | 'enregistrements' | 'pointage'
  const [activeSubTab, setActiveSubTab] = useState('khassidas');

  const [selectedKourelId, setSelectedKourelId] = useState(kourels[0]?.id || 'k1');
  const [selectedSeanceId, setSelectedSeanceId] = useState(seances[0]?.id || 's1');

  // Filter seances for selected kourel
  const kourelSeances = seances.filter((s) => s.kourel_id === selectedKourelId);
  const activeSeance = seances.find((s) => s.id === selectedSeanceId) || kourelSeances[0];

  const activeKhassida = khassidas.find((kh) => kh.id === activeSeance?.khassida_id);
  const membersOfKourel = membres.filter((m) => m.kourel_id === selectedKourelId);
  const selectedKourel = kourels.find((k) => k.id === selectedKourelId);

  const subNavItems = [
    { id: 'khassidas', label: 'Khassida à répéter', icon: BookOpen },
    { id: 'sons', label: 'Sons (Audios de référence)', icon: Music },
    { id: 'enregistrements', label: 'Enregistrements des séances', icon: Mic },
    { id: 'pointage', label: 'Pointage & Séances Live', icon: Calendar },
  ];

  return (
    <div className="space-y-6 pb-8 animate-fade-in select-none">
      {/* Sub-section Navigation Tabs */}
      <div className="bg-white rounded-3xl p-3 border border-ht-line shadow-soft flex flex-wrap items-center gap-2">
        {subNavItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-display font-semibold text-xs sm:text-sm transition-all ${
                isActive
                  ? 'gradient-emerald text-white shadow-md'
                  : 'bg-ht-page text-ht-inkSoft hover:bg-ht-mist hover:text-ht-ink border border-ht-line'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-ht-emerald'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Render Sub-view Content based on activeSubTab */}
      {activeSubTab === 'khassidas' && <KhassidasSubView />}

      {activeSubTab === 'sons' && <SonsSubView />}

      {activeSubTab === 'enregistrements' && <EnregistrementsSubView />}

      {activeSubTab === 'pointage' && (
        <div className="space-y-6">
          {/* Top Kourel Selector & Info Header */}
          <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-semibold text-ht-sage uppercase tracking-wider">
                Sélection du Kourel
              </span>
              <h2 className="font-display font-bold text-2xl text-ht-ink mt-0.5">
                {selectedKourel ? selectedKourel.nom : 'Kourel'}
              </h2>
              <p className="text-xs text-ht-inkSoft mt-1">
                Superviseurs rattachés : <span className="font-semibold text-ht-emerald">{selectedKourel?.superviseurs?.join(', ') || 'Superviseur'}</span>
              </p>
            </div>

            {/* Kourel Tabs Selector */}
            <div className="flex flex-wrap items-center gap-2">
              {kourels.map((k) => (
                <button
                  key={k.id}
                  onClick={() => {
                    setSelectedKourelId(k.id);
                    const firstSeanceOfKourel = seances.find((s) => s.kourel_id === k.id);
                    if (firstSeanceOfKourel) setSelectedSeanceId(firstSeanceOfKourel.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl font-display font-semibold text-xs transition-all ${
                    selectedKourelId === k.id
                      ? 'gradient-emerald text-white shadow-md'
                      : 'bg-ht-page text-ht-inkSoft hover:bg-ht-mist border border-ht-line'
                  }`}
                >
                  {k.nom.split('—')[1] || k.nom}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions Timeline & Selection Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-ht-ink flex items-center gap-2">
                <Calendar className="w-4 h-4 text-ht-emerald" />
                <span>Séances du Kourel ({kourelSeances.length})</span>
              </h3>
              <span className="text-xs text-ht-sage font-medium">
                {membersOfKourel.length} membres rattachés
              </span>
            </div>

            {/* Horizontal Seance Cards Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {kourelSeances.map((s) => {
                const kh = khassidas.find((item) => item.id === s.khassida_id);
                const isSelected = s.id === activeSeance?.id;

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSeanceId(s.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-ht-mist border-ht-emerald shadow-soft'
                        : 'bg-white border-ht-line hover:border-ht-mint'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-ht-emerald">
                        {s.date} ({s.heure_debut} - {s.heure_fin})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          s.statut === 'Terminée'
                            ? 'bg-ht-mist text-ht-emerald'
                            : 'bg-amber-50 text-ht-amber'
                        }`}
                      >
                        {s.statut}
                      </span>
                    </div>
                    <div className="font-display font-bold text-sm text-ht-ink truncate">
                      {kh ? kh.titre : 'Khassida'}
                    </div>
                    <div className="text-[11px] text-ht-sage mt-1">
                      Superviseur : {s.superviseur}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Seance Audio & Pointage Section */}
          {activeSeance && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Audio Player & Recording Card (1 Col) */}
              <div className="lg:col-span-1">
                <AudioPlayerCard seance={activeSeance} khassida={activeKhassida} />
              </div>

              {/* Pointage Table (2 Cols) */}
              <div className="lg:col-span-2">
                <PointageTable seance={activeSeance} membersOfKourel={membersOfKourel} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
