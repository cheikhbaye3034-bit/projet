import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, UserCheck, FileText, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const PointageRapideModal = ({ isOpen, onClose, seance, membersOfKourel, statutTarget }) => {
  const { bulkUpdatePointage, updatePointage } = useApp();

  const [textInput, setTextInput] = useState('');
  const [heureArrivee, setHeureArrivee] = useState('20:15');

  const isRetardMode = statutTarget === 'En retard';

  // On open, reset input and optionally pre-fill with current members of that statut
  useEffect(() => {
    if (isOpen && seance) {
      setHeureArrivee('20:15');

      const currentPointedNames = membersOfKourel
        .filter((m) => {
          const p = seance.presences?.find((item) => item.membre_id === m.id);
          return p && p.statut === statutTarget;
        })
        .map((m) => `${m.prenom} ${m.nom}`);

      setTextInput(currentPointedNames.join('\n'));
    }
  }, [isOpen, seance, statutTarget, membersOfKourel]);

  if (!isOpen || !seance) return null;

  // Real-time resolution of matched members from typed/pasted text
  const lines = textInput
    .split(/[\n,;]+/)
    .map((line) => line.trim().toLowerCase())
    .filter((line) => line.length > 0);

  const matchedMembers = membersOfKourel.filter((m) => {
    const fullName = `${m.prenom} ${m.nom}`.toLowerCase();
    const reversedName = `${m.nom} ${m.prenom}`.toLowerCase();
    const prenom = m.prenom.toLowerCase();
    const nom = m.nom.toLowerCase();
    const phone = (m.telephone || '').replace(/\s+/g, '');

    return lines.some(
      (line) =>
        fullName.includes(line) ||
        reversedName.includes(line) ||
        line.includes(prenom) ||
        line.includes(nom) ||
        (line.length > 3 && phone.includes(line))
    );
  });

  const matchedIds = matchedMembers.map((m) => m.id);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (matchedIds.length > 0) {
      if (bulkUpdatePointage) {
        bulkUpdatePointage(seance.id, matchedIds, statutTarget);
      } else {
        matchedIds.forEach((mId) => updatePointage(seance.id, mId, statutTarget, heureArrivee));
      }
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-3 sm:p-4 bg-slate-900/15 backdrop-blur-xs animate-fade-in select-none">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div
          className={`p-6 border-b border-ht-line flex items-center justify-between text-white ${
            isRetardMode ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'gradient-emerald'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-xs">
              {isRetardMode ? <Clock className="w-5 h-5 text-white" /> : <CheckCircle2 className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">
                Saisie des Membres {isRetardMode ? 'En Retard' : 'Présents'}
              </h3>
              <p className="text-xs text-white/80">
                Saisissez ou collez directement les noms ci-dessous
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Optional Heure Arrivee for Retards */}
          {isRetardMode && (
            <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between">
              <div className="text-xs font-semibold text-ht-amber flex items-center gap-2">
                <Clock className="w-4 h-4 text-ht-amber" />
                <span>Heure d'arrivée à attribuer :</span>
              </div>
              <input
                type="time"
                value={heureArrivee}
                onChange={(e) => setHeureArrivee(e.target.value)}
                className="px-3 py-1 bg-white border border-amber-300 rounded-lg text-xs font-bold text-ht-ink focus:outline-none"
              />
            </div>
          )}

          {/* Professional Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-ht-emerald" />
                Champ de Saisie des Noms
              </label>

              <span className="text-xs font-bold text-ht-sage">
                <strong className={isRetardMode ? 'text-ht-amber' : 'text-ht-emerald'}>
                  {matchedMembers.length}
                </strong>{' '}
                membre(s) reconnu(s)
              </span>
            </div>

            <textarea
              rows={6}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              autoFocus
              placeholder={`Saisissez ou collez ici la liste des membres ${isRetardMode ? 'en retard' : 'présents'} (un nom par ligne ou séparés par des virgules)...\n\nExemple :\nSerigne Cheikh Mbacké\nCheikh Ahmadou Ndiaye\nMoustapha Diop`}
              className="w-full p-4 bg-ht-page border border-ht-line rounded-2xl text-xs text-ht-ink font-semibold focus:outline-none focus:border-ht-emerald resize-none shadow-inner leading-relaxed"
            ></textarea>
          </div>

          {/* Real-time Recognized Members Chips */}
          {matchedMembers.length > 0 && (
            <div className="space-y-1.5">
              <div className="text-[11px] font-semibold text-ht-sage flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-ht-emerald" />
                <span>Membres identifiés sur la feuille :</span>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 max-h-28 overflow-y-auto p-2 bg-ht-page/50 rounded-xl border border-ht-line">
                {matchedMembers.map((m) => (
                  <span
                    key={m.id}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border flex items-center gap-1 ${
                      isRetardMode
                        ? 'bg-amber-50 text-ht-amber border-amber-200'
                        : 'bg-ht-mist text-ht-emerald border-ht-mint'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{m.prenom} {m.nom}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-ht-line flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-ht-page text-ht-inkSoft hover:bg-ht-mist rounded-xl text-xs font-semibold border border-ht-line transition-colors cursor-pointer"
            >
              Annuler
            </button>

            <button
              type="submit"
              className={`btn-anim px-6 py-2.5 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer ${
                isRetardMode ? 'bg-gradient-to-r from-amber-500 to-amber-600' : 'gradient-emerald'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Valider le pointage ({matchedMembers.length})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
