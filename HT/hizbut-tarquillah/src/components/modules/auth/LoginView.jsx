import React, { useState } from 'react';
import { Shield, Lock, PhoneCall, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../../context/AppContext';

export const LoginView = () => {
  const { login } = useApp();
  const [identifier, setIdentifier] = useState('admin@hizbut-tarquillah.sn');
  const [password, setPassword] = useState('••••••••••••');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      login(identifier, password);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-ht-page flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background Subtle Shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-ht-mint/40 to-transparent pointer-events-none rounded-b-[100px]"></div>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-ht-line shadow-soft-lg relative z-10">
        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-emerald text-white font-display font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-ht-emerald/20 tracking-wider">
            HT
          </div>
          <h1 className="font-display font-extrabold text-2xl text-ht-ink">
            Hizbut-Tarqiyyah
          </h1>
          <p className="text-xs font-medium text-ht-inkSoft">
            Espace superviseurs & administration
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider mb-2">
              Identifiant (Email ou Téléphone)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-ht-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="ex: admin@hizbut-tarquillah.sn ou 771234567"
                className="w-full pl-10 pr-4 py-3 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern focus:ring-1 focus:ring-ht-fern transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-ht-ink uppercase tracking-wider">
                Mot de passe
              </label>
              <a
                href="#forgot"
                onClick={(e) => { e.preventDefault(); alert("Veuillez contacter le Super Admin général pour réinitialiser vos accès."); }}
                className="text-xs font-medium text-ht-emerald hover:underline"
              >
                Mot de passe oublié ?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-ht-sage absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-ht-page border border-ht-line rounded-xl text-sm text-ht-ink focus:outline-none focus:border-ht-fern focus:ring-1 focus:ring-ht-fern transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 gradient-emerald text-white rounded-xl font-display font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            <span>{isSubmitting ? 'Connexion en cours...' : 'Se connecter au Dashboard'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Informational notice */}
        <div className="mt-8 pt-6 border-t border-ht-line text-center">
          <div className="inline-flex items-center gap-2 text-xs text-ht-inkSoft bg-ht-mist px-3.5 py-2 rounded-xl border border-ht-mint">
            <Shield className="w-4 h-4 text-ht-emerald flex-shrink-0" />
            <span>Accès restreint aux responsables et superviseurs autorisés.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
