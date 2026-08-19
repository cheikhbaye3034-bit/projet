import React, { useState } from 'react';
import { Calendar, Music, Mic, BookOpen, Volume2, CheckCircle2, Clock, Users, Plus, ChevronRight, BarChart3 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { KhassidasSubView } from './KhassidasSubView';
import { SonsSubView } from './SonsSubView';
import { EnregistrementsSubView } from './EnregistrementsSubView';
import { PointageTable } from './PointageTable';
import { NouvelleSeanceModal } from './NouvelleSeanceModal';
import { ResumeSeancesModal } from './ResumeSeancesModal';

export const RepetitionView = () => {
  const { kourels, seances, khassidas, membres } = useApp();

  // Active sub-section state: 'khassidas' | 'sons' | 'enregistrements' | 'pointage'
  const [activeSubTab, setActiveSubTab] = useState('khassidas');

  const [selectedKourelId, setSelectedKourelId] = useState(kourels[0]?.id || 'k1');
  const [selectedSeanceId, setSelectedSeanceId] = useState(seances[0]?.id || 's1');

  // Modals state
  const [isNewSeanceModalOpen, setIsNewSeanceModalOpen] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

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
      <div className="bg-white rounded-3xl p-2.5 sm:p-3 border border-ht-line shadow-soft flex items-center gap-2 overflow-x-auto no-scrollbar">
        {subNavItems.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-display font-semibold text-xs sm:text-sm whitespace-nowrap flex-shrink-0 transition-all ${
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
          {/* Top Kourel Selector & Action Header */}
          <div className="bg-white rounded-3xl p-6 border border-ht-line shadow-soft space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-ht-sage uppercase tracking-wider">
                  Sélection du Kourel & Gestion du Pointage
                </span>
                <h2 className="font-display font-bold text-2xl text-ht-ink mt-0.5">
                  {selectedKourel ? selectedKourel.nom : 'Kourel'}
                </h2>
                <p className="text-xs text-ht-inkSoft mt-1">
                  Superviseurs rattachés : <span className="font-semibold text-ht-emerald">{selectedKourel?.superviseurs?.join(', ') || 'Superviseur'}</span>
                </p>
              </div>

              {/* Action Buttons: Nouvelle Feuille & Résumé */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsResumeModalOpen(true)}
                  className="btn-anim px-4 py-2.5 bg-ht-page hover:bg-ht-mist text-ht-ink font-semibold text-xs rounded-2xl border border-ht-line flex items-center gap-2 cursor-pointer transition-all"
                >
                  <BarChart3 className="w-4 h-4 text-ht-emerald" />
                  <span>Résumé des séances</span>
                </button>

                <button
                  onClick={() => setIsNewSeanceModalOpen(true)}
                  className="btn-anim px-4 py-2.5 gradient-emerald text-white font-bold text-xs rounded-2xl shadow-md flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouvelle feuille de pointage</span>
                </button>
              </div>
            </div>

            {/* Kourel & Séance Selectors row */}
            <div className="pt-4 border-t border-ht-line flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-ht-sage mr-1">Kourels :</span>
                {kourels.map((k) => (
                  <button
                    key={k.id}
                    onClick={() => {
                      setSelectedKourelId(k.id);
                      const firstSeanceOfKourel = seances.find((s) => s.kourel_id === k.id);
                      if (firstSeanceOfKourel) setSelectedSeanceId(firstSeanceOfKourel.id);
                    }}
                    className={`px-3.5 py-2 rounded-xl font-display font-semibold text-xs transition-all ${
                      selectedKourelId === k.id
                        ? 'gradient-emerald text-white shadow-md'
                        : 'bg-ht-page text-ht-inkSoft hover:bg-ht-mist border border-ht-line'
                    }`}
                  >
                    {k.nom.split('—')[1] || k.nom}
                  </button>
                ))}
              </div>

              {kourelSeances.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-ht-sage">Séance active :</span>
                  <select
                    value={activeSeance?.id || ''}
                    onChange={(e) => setSelectedSeanceId(e.target.value)}
                    className="px-3 py-1.5 rounded-xl bg-ht-page text-ht-ink font-semibold text-xs border border-ht-line focus:outline-none focus:border-ht-emerald"
                  >
                    {kourelSeances.map((s) => (
                      <option key={s.id} value={s.id}>
                        Séance du {s.date} ({s.heure_debut} - {s.heure_fin})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Pointage Table (Full Width) */}
          {activeSeance ? (
            <PointageTable seance={activeSeance} membersOfKourel={membersOfKourel} />
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-ht-line shadow-soft text-center text-ht-sage text-sm italic">
              Aucune séance disponible pour ce kourel. Cliquez sur "Nouvelle feuille de pointage" pour en créer une.
            </div>
          )}
        </div>
      )}

      {/* Nouvelle Séance Modal */}
      <NouvelleSeanceModal
        isOpen={isNewSeanceModalOpen}
        onClose={() => setIsNewSeanceModalOpen(false)}
        defaultKourelId={selectedKourelId}
        onSeanceCreated={(newSeanceId) => setSelectedSeanceId(newSeanceId)}
      />

      {/* Résumé des Séances Modal */}
      <ResumeSeancesModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
        defaultKourelId={selectedKourelId}
      />
    </div>
  );
};
