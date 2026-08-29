import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Download, 
  Sparkles, 
  ArrowRight, 
  DollarSign, 
  TrendingUp, 
  Receipt, 
  Phone, 
  ShieldCheck, 
  X, 
  Check, 
  QrCode,
  Printer
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const MembreCotisationTab = () => {
  const { currentUser, showToast } = useApp();

  // Financial status state
  const [totalAssigne, setTotalAssigne] = useState(25000);
  const [totalPaye, setTotalPaye] = useState(20000);
  const resteAPayer = Math.max(totalAssigne - totalPaye, 0);
  const progressPercent = Math.round((totalPaye / totalAssigne) * 100);

  // Campaigns list
  const [campaigns, setCampaigns] = useState([
    { id: 'c1', titre: 'Cotisation Mensuelle — Août 2026', montant: 5000, echeance: '2026-08-31', statut: 'Payé', date_paiement: '2026-08-10', methode: 'Wave' },
    { id: 'c2', titre: 'Participation Grand Magal de Touba', montant: 10000, echeance: '2026-09-15', statut: 'Payé', date_paiement: '2026-08-05', methode: 'Orange Money' },
    { id: 'c3', titre: 'Rénovation & Équipement Daara Central', montant: 5000, echeance: '2026-08-28', statut: 'Payé', date_paiement: '2026-07-20', methode: 'Wave' },
    { id: 'c4', titre: 'Cotisation Mensuelle — Septembre 2026', montant: 5000, echeance: '2026-09-30', statut: 'En attente', date_paiement: null, methode: null },
  ]);

  // Receipts history
  const [receipts, setReceipts] = useState([
    { id: 'REC-2026-0801', date: '10 Août 2026', montant: 5000, motif: 'Cotisation Mensuelle — Août 2026', methode: 'Wave', reference: 'WV-984214-SN' },
    { id: 'REC-2026-0792', date: '05 Août 2026', montant: 10000, motif: 'Participation Grand Magal de Touba', methode: 'Orange Money', reference: 'OM-773120-SN' },
    { id: 'REC-2026-0715', date: '20 Juil 2026', montant: 5000, motif: 'Rénovation & Équipement Daara Central', methode: 'Wave', reference: 'WV-651209-SN' },
  ]);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('wave'); // 'wave' | 'orange_money'
  const [paymentAmount, setPaymentAmount] = useState(5000);
  const [paymentPhone, setPaymentPhone] = useState(currentUser?.telephone || '+221 77 654 32 10');
  const [paymentMotif, setPaymentMotif] = useState('Cotisation Mensuelle — Septembre 2026');
  const [paymentStep, setPaymentStep] = useState('form'); // 'form' | 'processing' | 'success'

  // Generated Receipt Modal State
  const [selectedReceiptForView, setSelectedReceiptForView] = useState(null);

  // Trigger Payment Flow
  const handleInitiatePayment = (campaign) => {
    if (campaign) {
      setPaymentMotif(campaign.titre);
      setPaymentAmount(campaign.montant);
    }
    setPaymentStep('form');
    setIsPaymentModalOpen(true);
  };

  // Process mobile money transaction
  const handleProcessPayment = (e) => {
    e.preventDefault();
    setPaymentStep('processing');

    setTimeout(() => {
      // 1. Update financial balance
      setTotalPaye(prev => prev + paymentAmount);

      // 2. Create new receipt
      const newRecu = {
        id: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
        montant: paymentAmount,
        motif: paymentMotif,
        methode: selectedMethod === 'wave' ? 'Wave' : 'Orange Money',
        reference: selectedMethod === 'wave' ? `WV-${Math.floor(100000 + Math.random() * 900000)}-SN` : `OM-${Math.floor(100000 + Math.random() * 900000)}-SN`
      };

      setReceipts(prev => [newRecu, ...prev]);

      // 3. Mark campaign as paid if matching
      setCampaigns(prev => prev.map(c => {
        if (c.titre === paymentMotif) {
          return { ...c, statut: 'Payé', date_paiement: newRecu.date, methode: newRecu.methode };
        }
        return c;
      }));

      setPaymentStep('success');
      setSelectedReceiptForView(newRecu);
      showToast(`Paiement de ${paymentAmount.toLocaleString()} FCFA reçu avec succès !`);
    }, 2000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12 select-none">
      
      {/* =========================================================================
          EN-TÊTE FINANCIER & STATISTIQUES DES COTISATIONS
      ========================================================================= */}
      <div className="pro-card p-6 sm:p-8 bg-gradient-to-br from-[#144631] via-[#1A573D] to-[#0A261A] text-white shadow-soft-xl border border-[#E4CE98]/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-200">
              <CreditCard className="w-3.5 h-3.5 text-amber-300" />
              <span>Cotisations & Contributions au Dahira</span>
            </div>

            <h2 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Situation Financière Personnelle
            </h2>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Réglez vos cotisations en toute sécurité via <span className="font-bold text-[#1DC3F3]">Wave</span> ou <span className="font-bold text-[#FF6600]">Orange Money</span> et téléchargez instantanément vos reçus officiels.
            </p>

            <div className="pt-2">
              <button
                onClick={() => handleInitiatePayment()}
                className="px-6 py-3.5 bg-gradient-to-r from-[#D49E34] via-[#E5B246] to-[#D49E34] hover:from-[#E5B246] hover:to-[#D49E34] active:scale-95 text-slate-900 font-display font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Effectuer un Paiement Mobile Money</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Synthesis Card & Progress Bar */}
          <div className="p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 min-w-[280px] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200">Progression globale</span>
              <span className="text-lg font-black text-[#E5B246]">{progressPercent}%</span>
            </div>

            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-[#E5B246] rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
              <div>
                <span className="text-slate-300 text-[11px] block">Payé</span>
                <span className="text-sm font-bold text-emerald-300">{totalPaye.toLocaleString()} F</span>
              </div>
              <div>
                <span className="text-slate-300 text-[11px] block">Reste dû</span>
                <span className="text-sm font-bold text-amber-300">{resteAPayer.toLocaleString()} F</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          SECTION : CAMPAGNES & ÉVÉNEMENTS DE COTISATION
      ========================================================================= */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-800" />
          <span>Mes Cotisations & Événements</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {campaigns.map((camp) => {
            const isPaid = camp.statut === 'Payé';
            return (
              <div 
                key={camp.id}
                className={`pro-card p-5 sm:p-6 border-2 flex flex-col justify-between space-y-4 transition-all ${
                  isPaid 
                    ? 'border-emerald-200/80 bg-emerald-50/30' 
                    : 'border-amber-300/80 bg-amber-50/40 shadow-soft-sm'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      isPaid 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-900 animate-pulse'
                    }`}>
                      {isPaid ? 'Régularisé' : 'À régler'}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Échéance : {camp.echeance}
                    </span>
                  </div>

                  <h4 className="font-display font-bold text-base text-slate-900">
                    {camp.titre}
                  </h4>

                  <div className="text-xl font-display font-black text-slate-900">
                    {camp.montant.toLocaleString()} FCFA
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  {isPaid ? (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Payé le {camp.date_paiement} via {camp.methode}</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleInitiatePayment(camp)}
                      className="px-4 py-2 bg-gradient-to-r from-emerald-800 to-[#144631] hover:from-[#144631] hover:to-emerald-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Payer {camp.montant.toLocaleString()} F</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SECTION : HISTORIQUE DES REÇUS OFFICIELS
      ========================================================================= */}
      <div className="pro-card p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Receipt className="w-5 h-5 text-emerald-800" />
              <span>Historique des Reçus de Paiement</span>
            </h3>
            <p className="text-xs text-slate-500">Justificatifs électroniques officiels de versement.</p>
          </div>
        </div>

        <div className="space-y-3">
          {receipts.map((recu) => (
            <div 
              key={recu.id}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${
                  recu.methode === 'Wave' ? 'bg-[#1DC3F3]/20 text-[#0095C2]' : 'bg-[#FF6600]/20 text-[#FF6600]'
                }`}>
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-slate-900">{recu.motif}</span>
                    <span className="text-[10px] font-extrabold px-2 py-0.2 rounded bg-white text-slate-700 border border-slate-200">
                      {recu.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {recu.date} • {recu.methode} (Réf: {recu.reference})
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-center">
                <span className="font-display font-black text-sm text-emerald-800">
                  {recu.montant.toLocaleString()} FCFA
                </span>

                <button
                  onClick={() => setSelectedReceiptForView(recu)}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-700 hover:text-white text-slate-700 border border-slate-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-soft-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Voir le Reçu</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          MODAL DE PAIEMENT SÉCURISÉ (WAVE & ORANGE MONEY)
      ========================================================================= */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/15 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-emerald-900/10 flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#144631] to-[#1F5E43] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  Paiement Sécurisé Mobile Money
                </span>
                <h3 className="font-display font-bold text-base text-white mt-0.5">
                  Cotisation Hizbut-Tarqiyyah
                </h3>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body: Form / Processing / Success */}
            <div className="p-6">
              
              {paymentStep === 'form' && (
                <form onSubmit={handleProcessPayment} className="space-y-4">
                  
                  {/* Select Payment Provider */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      Moyen de Paiement
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {/* Wave */}
                      <div
                        onClick={() => setSelectedMethod('wave')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                          selectedMethod === 'wave' 
                            ? 'border-[#1DC3F3] bg-[#1DC3F3]/10 shadow-soft-sm' 
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#1DC3F3] text-white flex items-center justify-center font-bold text-sm">
                          🌊
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">Wave</div>
                          <div className="text-[10px] text-slate-500 font-semibold">1% de frais</div>
                        </div>
                      </div>

                      {/* Orange Money */}
                      <div
                        onClick={() => setSelectedMethod('orange_money')}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-3 ${
                          selectedMethod === 'orange_money' 
                            ? 'border-[#FF6600] bg-[#FF6600]/10 shadow-soft-sm' 
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-[#FF6600] text-white flex items-center justify-center font-bold text-sm">
                          🍊
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">Orange Money</div>
                          <div className="text-[10px] text-slate-500 font-semibold">Code #144#</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Motif */}
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      Motif du Versement
                    </label>
                    <input
                      type="text"
                      required
                      value={paymentMotif}
                      onChange={(e) => setPaymentMotif(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  {/* Montant avec boutons de sélection rapide */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                        Montant à Verser (FCFA)
                      </label>
                      <span className="text-[11px] font-bold text-emerald-800">
                        {paymentAmount.toLocaleString()} FCFA
                      </span>
                    </div>

                    <input
                      type="number"
                      min="500"
                      step="500"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-base font-black text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                    />

                    {/* Quick amount chips */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {[2500, 5000, 10000, 20000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setPaymentAmount(amt)}
                          className={`py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                            paymentAmount === amt
                              ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                        >
                          {amt >= 1000 ? `${amt / 1000}k` : amt} F
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Numéro de téléphone */}
                  <div className="space-y-1">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                      Numéro Mobile Money
                    </label>
                    <input
                      type="tel"
                      required
                      value={paymentPhone}
                      onChange={(e) => setPaymentPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-emerald-800 to-[#144631] hover:from-[#144631] hover:to-emerald-800 active:scale-95 text-white font-display font-bold text-xs sm:text-sm rounded-xl shadow-soft-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Valider le Paiement de {paymentAmount.toLocaleString()} FCFA</span>
                    <ArrowRight className="w-4 h-4 text-emerald-200" />
                  </button>
                </form>
              )}

              {paymentStep === 'processing' && (
                <div className="py-8 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-200 border-t-emerald-800 animate-spin mx-auto"></div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-base text-slate-900">
                      Transaction en cours...
                    </h4>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Veuillez valider la notification sur votre application {selectedMethod === 'wave' ? 'Wave' : 'Orange Money'}.
                    </p>
                  </div>
                </div>
              )}

              {paymentStep === 'success' && (
                <div className="py-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-soft-xs">
                    <Check className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-display font-bold text-lg text-slate-900">
                      Paiement Confirmé !
                    </h4>
                    <p className="text-xs text-slate-600">
                      Votre versement a été enregistré et validé par le Dahira.
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => setIsPaymentModalOpen(false)}
                      className="flex-1 py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                    >
                      Terminer
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DE REÇU OFFICIEL IMPRIMABLE & TÉLÉCHARGEABLE
      ========================================================================= */}
      {selectedReceiptForView && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-slate-900/15 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-emerald-900/10 flex flex-col animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-[#144631] to-[#1F5E43] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-amber-300" />
                <span className="font-display font-bold text-sm text-white">Reçu Officiel de Paiement</span>
              </div>
              <button
                onClick={() => setSelectedReceiptForView(null)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Printable Receipt Body */}
            <div className="p-6 sm:p-8 space-y-6 text-slate-800 bg-white">
              
              {/* Receipt Top Brand Header */}
              <div className="flex items-center justify-between border-b pb-4 border-slate-200">
                <div>
                  <h3 className="font-display font-black text-base text-[#144631]">
                    HIZBUT-TARQIYYAH
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Daara Central • Reçu Électronique
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">
                    PAYÉ ✓
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{selectedReceiptForView.id}</p>
                </div>
              </div>

              {/* Receipt Details Table */}
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Membre bénéficiaire :</span>
                  <span className="font-bold text-slate-900">{currentUser?.prenom} {currentUser?.nom}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Matricule :</span>
                  <span className="font-mono font-bold text-slate-800">{currentUser?.matricule || 'HT-2026-0142'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Date de règlement :</span>
                  <span className="font-bold text-slate-800">{selectedReceiptForView.date}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Moyen & Réf :</span>
                  <span className="font-bold text-slate-800">{selectedReceiptForView.methode} ({selectedReceiptForView.reference})</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Motif :</span>
                  <span className="font-bold text-slate-900">{selectedReceiptForView.motif}</span>
                </div>
              </div>

              {/* Grand Total */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between">
                <span className="font-display font-bold text-sm text-emerald-900">Total versé :</span>
                <span className="font-display font-black text-xl text-emerald-800">
                  {selectedReceiptForView.montant.toLocaleString()} FCFA
                </span>
              </div>

              {/* Security Seal & Note */}
              <div className="flex items-center justify-between pt-2 text-[10px] text-slate-400">
                <span>Certifié par la Trésorerie Centrale</span>
                <span className="font-mono">Tampon Électronique Validé</span>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer shadow-soft-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>

              <button
                onClick={() => {
                  showToast('Reçu PDF téléchargé avec succès !');
                  setSelectedReceiptForView(null);
                }}
                className="px-5 py-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger PDF</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
