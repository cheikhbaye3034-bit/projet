import React, { useState } from 'react';
import {
  Settings, Building2, KeyRound, Users, Layers, Briefcase,
  Shield, Sun, Moon, Plus, Trash2, Edit3, Check, X,
  Copy, RefreshCw, Eye, EyeOff, ChevronRight, Upload,
  UserCog, Crown, Save, Phone, Mail, Calendar, Lock
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

// ─── Tab IDs ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'general',      label: 'Général',        icon: Building2 },
  { id: 'security',     label: 'Codes d\'accès',  icon: KeyRound  },
  { id: 'kourels',      label: 'Kourels',         icon: Layers    },
  { id: 'secteurs',     label: 'Secteurs',        icon: Briefcase },
  { id: 'responsables', label: 'Responsables',    icon: UserCog   },
];

// ─── Reusable Section Title ──────────────────────────────────────────────────
const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-2xl bg-emerald-900 flex items-center justify-center shadow-sm flex-shrink-0">
      <Icon className="w-5 h-5 text-emerald-200" />
    </div>
    <div>
      <h2 className="font-display font-black text-base text-slate-900">{title}</h2>
      {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
    </div>
  </div>
);

// ─── Reusable Input Field ────────────────────────────────────────────────────
const FieldInput = ({ label, value, onChange, placeholder, type = 'text', className = '' }) => (
  <div className={className}>
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all"
    />
  </div>
);

// ─── General Settings Tab ────────────────────────────────────────────────────
const TabGeneral = ({ appSettings, updateAppSettings, showToast }) => {
  const [formData, setFormData] = useState({
    daaraName: appSettings?.daaraName || 'Daara Hizbut-Tarqiyyah',
    siegeVille: appSettings?.siegeVille || 'Touba / Dakar',
    contactPhone: appSettings?.contactPhone || '+221 77 500 12 34',
    contactEmail: appSettings?.contactEmail || 'contact@hizbut-tarquillah.sn',
    slogan: appSettings?.slogan || 'Portail Officiel de Gestion & Dévotion'
  });

  const isDark = appSettings?.theme === 'dark';

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    updateAppSettings(formData);
    showToast && showToast('✅ Paramètres généraux du Daara enregistrés avec succès !');
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={Building2}
        title="Identité & Paramètres Généraux"
        subtitle="Configurez le nom, les coordonnées officielles et l'apparence générale de votre plateforme."
      />

      {/* Daara Identity Form */}
      <form onSubmit={handleSaveAll} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-black text-slate-800">Informations Générales</h3>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Enregistrement Direct
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldInput
            label="Nom officiel du Daara"
            value={formData.daaraName}
            onChange={(val) => handleChange('daaraName', val)}
            placeholder="ex: Daara Hizbut-Tarqiyyah"
          />

          <FieldInput
            label="Slogan / Sous-titre"
            value={formData.slogan}
            onChange={(val) => handleChange('slogan', val)}
            placeholder="ex: Portail de Gestion & Dévotion"
          />

          <FieldInput
            label="Siège / Ville Principale"
            value={formData.siegeVille}
            onChange={(val) => handleChange('siegeVille', val)}
            placeholder="ex: Touba Mosquée / Dakar"
          />

          <FieldInput
            label="Téléphone de Contact Officiel"
            value={formData.contactPhone}
            onChange={(val) => handleChange('contactPhone', val)}
            placeholder="ex: +221 77 000 00 00"
          />

          <FieldInput
            label="Email Officiel de l'Association"
            value={formData.contactEmail}
            onChange={(val) => handleChange('contactEmail', val)}
            placeholder="ex: contact@hizbut-tarquillah.sn"
            type="email"
            className="sm:col-span-2"
          />
        </div>

        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
          <p className="text-[11px] text-slate-400">Ces informations seront reflétées sur la barre latérale, l'accueil et les fiches.</p>
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4 text-emerald-200" />
            <span>Sauvegarder les modifications</span>
          </button>
        </div>
      </form>

      {/* Theme Toggle */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-sm font-black text-slate-800 border-b border-slate-100 pb-3 mb-4">Thème d'affichage</h3>
        <div className="grid grid-cols-2 gap-4">
          {/* Light Mode */}
          <button
            type="button"
            onClick={() => {
              updateAppSettings({ theme: 'light' });
              showToast && showToast('☀️ Mode Clair activé !');
            }}
            className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${
              !isDark ? 'border-emerald-600 bg-emerald-50/60 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center">
              <Sun className={`w-6 h-6 ${!isDark ? 'text-amber-500' : 'text-slate-400'}`} />
            </div>
            <div className="text-center">
              <p className={`text-xs font-bold ${!isDark ? 'text-emerald-900' : 'text-slate-600'}`}>Mode Clair</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Fond blanc, texte sombre</p>
            </div>
            {!isDark && (
              <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
            )}
          </button>

          {/* Dark Mode */}
          <button
            type="button"
            onClick={() => {
              updateAppSettings({ theme: 'dark' });
              showToast && showToast('🌙 Mode Sombre activé !');
            }}
            className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 cursor-pointer ${
              isDark ? 'border-emerald-600 bg-emerald-50/60 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 shadow-sm flex items-center justify-center">
              <Moon className={`w-6 h-6 ${isDark ? 'text-amber-400' : 'text-slate-500'}`} />
            </div>
            <div className="text-center">
              <p className={`text-xs font-bold ${isDark ? 'text-emerald-900' : 'text-slate-600'}`}>Mode Sombre</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Fond sombre, texte clair</p>
            </div>
            {isDark && (
              <span className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-emerald-600 flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </span>
            )}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-3">Le thème est sauvegardé automatiquement et appliqué immédiatement à l'ensemble de la plateforme.</p>
      </div>
    </div>
  );
};

// ─── Security / Access Codes Tab ─────────────────────────────────────────────
const TabSecurity = ({ appSettings, updateAppSettings }) => {
  const [memberCode, setMemberCode]         = useState(appSettings.memberAccessCode);
  const [respCode, setRespCode]             = useState(appSettings.responsableAccessCode);
  const [showMemberCode, setShowMemberCode] = useState(false);
  const [showRespCode, setShowRespCode]     = useState(false);
  const [copied, setCopied]                 = useState(null);

  const generateCode = () => String(Math.floor(100000 + Math.random() * 900000));

  const handleCopy = (code, which) => {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(which);
    setTimeout(() => setCopied(null), 1800);
  };

  const handleSave = () => {
    if (memberCode.trim().length < 4 || respCode.trim().length < 4) return;
    updateAppSettings({ memberAccessCode: memberCode.trim(), responsableAccessCode: respCode.trim() });
  };

  const CodeField = ({ label, value, onChange, show, onToggle, which, description }) => (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 space-y-3">
      <div className="flex items-center gap-2">
        <Lock className="w-4 h-4 text-emerald-800" />
        <span className="text-sm font-bold text-slate-900">{label}</span>
      </div>
      <p className="text-[11px] text-slate-500">{description}</p>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-emerald-600 transition-all pr-10"
          />
          <button
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={() => { const c = generateCode(); onChange(c); }}
          title="Générer un code aléatoire"
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleCopy(value, which)}
          title="Copier le code"
          className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-800 transition-all"
        >
          {copied === which ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={KeyRound}
        title="Codes d'accès & Sécurité"
        subtitle="Gérez les codes permettant aux membres et responsables de se connecter à la plateforme."
      />

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800">
          <p className="font-bold mb-1">Important — Sécurité des codes</p>
          <p>Ces codes donnent accès à la plateforme. Ne les partagez qu'avec les personnes autorisées. Un membre utilise le <strong>code membre</strong>, un administrateur utilise le <strong>code responsable</strong>.</p>
        </div>
      </div>

      <div className="space-y-4">
        <CodeField
          label="Code d'accès — Membres"
          value={memberCode}
          onChange={setMemberCode}
          show={showMemberCode}
          onToggle={() => setShowMemberCode(v => !v)}
          which="member"
          description="Ce code est requis à l'étape finale de connexion pour tous les membres du Daara."
        />
        <CodeField
          label="Code d'accès — Responsables"
          value={respCode}
          onChange={setRespCode}
          show={showRespCode}
          onToggle={() => setShowRespCode(v => !v)}
          which="resp"
          description="Ce code est requis à l'étape finale de connexion pour les administrateurs et superviseurs."
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full py-3 bg-emerald-800 hover:bg-emerald-900 text-white rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm"
      >
        <Save className="w-4 h-4" />
        Sauvegarder les codes d'accès
      </button>
    </div>
  );
};

// ─── Kourels Tab ─────────────────────────────────────────────────────────────
const TabKourels = ({ kourels, addKourel, updateKourel, deleteKourel }) => {
  const [newNom, setNewNom]     = useState('');
  const [editing, setEditing]   = useState(null); // { id, nom }
  const [showAdd, setShowAdd]   = useState(false);

  const handleAdd = () => {
    if (!newNom.trim()) return;
    addKourel({ nom: newNom.trim() });
    setNewNom('');
    setShowAdd(false);
  };

  const handleSaveEdit = (id) => {
    if (!editing?.nom.trim()) return;
    updateKourel(id, { nom: editing.nom.trim() });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={Layers}
        title="Gestion des Kourels"
        subtitle={`${kourels.length} Kourel(s) configuré(s). Ajoutez, renommez ou supprimez des Kourels.`}
      />

      {/* Add Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(v => !v)}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter un Kourel
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-end gap-3">
          <FieldInput
            label="Nom du nouveau Kourel"
            value={newNom}
            onChange={setNewNom}
            placeholder="ex: Kourel 5 — Boustane"
            className="flex-1"
          />
          <button onClick={handleAdd} className="px-4 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all flex-shrink-0">
            <Check className="w-3.5 h-3.5" /> Confirmer
          </button>
          <button onClick={() => setShowAdd(false)} className="px-3 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold active:scale-95 transition-all flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {kourels.map((k, i) => (
          <div key={k.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-900 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
              {i + 1}
            </div>

            {editing?.id === k.id ? (
              <input
                type="text"
                value={editing.nom}
                onChange={e => setEditing(prev => ({ ...prev, nom: e.target.value }))}
                autoFocus
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-emerald-400 rounded-xl text-sm font-medium focus:outline-none"
              />
            ) : (
              <span className="flex-1 text-sm font-semibold text-slate-900">{k.nom}</span>
            )}

            <div className="flex items-center gap-2 flex-shrink-0">
              {editing?.id === k.id ? (
                <>
                  <button onClick={() => handleSaveEdit(k.id)} className="p-2 bg-emerald-100 text-emerald-800 rounded-xl hover:bg-emerald-200 transition-colors">
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setEditing(null)} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </>
              ) : (
                <button onClick={() => setEditing({ id: k.id, nom: k.nom })} className="p-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-emerald-100 hover:text-emerald-800 transition-colors">
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  if (window.confirm(`Supprimer le Kourel « ${k.nom} » ?`)) deleteKourel(k.id);
                }}
                className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {kourels.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm italic">Aucun Kourel configuré.</div>
        )}
      </div>
    </div>
  );
};

// ─── Secteurs Tab ─────────────────────────────────────────────────────────────
const TabSecteurs = ({ secteurs, addSecteur, deleteSecteur }) => {
  const [newNom, setNewNom] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    if (!newNom.trim()) return;
    addSecteur(newNom.trim());
    setNewNom('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={Briefcase}
        title="Secteurs d'Activités"
        subtitle={`${secteurs.length} secteur(s) configuré(s). Gérez les commissions opérationnelles du Daara.`}
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(v => !v)}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter un secteur
        </button>
      </div>

      {showAdd && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-end gap-3">
          <FieldInput
            label="Nom du secteur d'activité"
            value={newNom}
            onChange={setNewNom}
            placeholder="ex: Commission Hygiène & Santé"
            className="flex-1"
          />
          <button onClick={handleAdd} className="px-4 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all flex-shrink-0">
            <Check className="w-3.5 h-3.5" /> Confirmer
          </button>
          <button onClick={() => setShowAdd(false)} className="px-3 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold active:scale-95 transition-all flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        {secteurs.map((s, i) => (
          <div key={s.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center flex-shrink-0">
              {i + 1}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900">{s.nom}</p>
              {s.description && <p className="text-[11px] text-slate-500 truncate mt-0.5">{s.description}</p>}
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mr-3 flex-shrink-0">
              <Users className="w-3.5 h-3.5" />
              <span>{s.membres_count || 0} membres</span>
            </div>
            <button
              onClick={() => {
                if (window.confirm(`Supprimer le secteur « ${s.nom} » ?`)) deleteSecteur(s.id);
              }}
              className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {secteurs.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm italic">Aucun secteur d'activité configuré.</div>
        )}
      </div>
    </div>
  );
};

// ─── Responsables Tab ─────────────────────────────────────────────────────────
const TabResponsables = ({ responsables, addResponsable, deleteResponsable }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ prenom: '', nom: '', email: '', telephone: '', role: 'Responsable' });

  const ROLES = ['Super Admin', 'Superviseur Kourels', 'Responsable Kamil & Audios', 'Responsable Répétition', 'Responsable'];

  const handleAdd = () => {
    if (!form.prenom.trim() || !form.nom.trim()) return;
    addResponsable(form);
    setForm({ prenom: '', nom: '', email: '', telephone: '', role: 'Responsable' });
    setShowAdd(false);
  };

  const roleColors = {
    'Super Admin': 'bg-amber-100 text-amber-900 border border-amber-200',
    'Superviseur Kourels': 'bg-blue-100 text-blue-900 border border-blue-200',
    'Responsable Kamil & Audios': 'bg-violet-100 text-violet-900 border border-violet-200',
  };

  const getRoleStyle = (role) => roleColors[role] || 'bg-slate-100 text-slate-800 border border-slate-200';

  return (
    <div className="space-y-6">
      <SectionTitle
        icon={UserCog}
        title="Équipe des Responsables"
        subtitle={`${responsables.length} responsable(s) enregistré(s). Gérez les comptes administrateurs du Daara.`}
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowAdd(v => !v)}
          className="px-4 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          Ajouter un responsable
        </button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-emerald-900">Nouveau responsable</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FieldInput label="Prénom" value={form.prenom} onChange={v => setForm(p => ({ ...p, prenom: v }))} placeholder="ex: Serigne Modou" />
            <FieldInput label="Nom de famille" value={form.nom} onChange={v => setForm(p => ({ ...p, nom: v }))} placeholder="ex: Kara" />
            <FieldInput label="Email" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} placeholder="ex: admin@daara.sn" type="email" />
            <FieldInput label="Téléphone" value={form.telephone} onChange={v => setForm(p => ({ ...p, telephone: v }))} placeholder="ex: +221 77 000 00 00" />
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Rôle</label>
              <select
                value={form.role}
                onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:border-emerald-600 transition-all"
              >
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleAdd} className="px-5 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all">
              <Check className="w-3.5 h-3.5" /> Confirmer l'ajout
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold active:scale-95 transition-all">
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {responsables.map((r) => (
          <div key={r.id} className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-4 shadow-sm flex-col sm:flex-row">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-800 to-emerald-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
              {(r.prenom[0] || '?')}{(r.nom[0] || '?')}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display font-bold text-sm text-slate-900">{r.prenom} {r.nom}</span>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${getRoleStyle(r.role)}`}>{r.role}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                {r.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{r.email}</span>}
                {r.telephone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{r.telephone}</span>}
                {r.date_creation && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Depuis le {r.date_creation}</span>}
              </div>
            </div>

            {/* Delete Button */}
            <button
              onClick={() => {
                if (window.confirm(`Révoquer l'accès de ${r.prenom} ${r.nom} ?`)) deleteResponsable(r.id);
              }}
              className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors flex-shrink-0 self-start sm:self-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {responsables.length === 0 && (
          <div className="text-center py-10 text-slate-400 text-sm italic">Aucun responsable enregistré.</div>
        )}
      </div>
    </div>
  );
};

// ─── Main ReglagesView ────────────────────────────────────────────────────────
export const ReglagesView = () => {
  const {
    appSettings, updateAppSettings,
    kourels, addKourel, updateKourel, deleteKourel,
    secteurs, addSecteur, deleteSecteur,
    responsables, addResponsable, deleteResponsable,
    currentUser, showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('general');

  // Guard: Only responsables can access this section
  if (currentUser?.role === 'Membre') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-rose-100 flex items-center justify-center">
          <Shield className="w-8 h-8 text-rose-600" />
        </div>
        <h2 className="font-display font-black text-xl text-slate-900">Accès restreint</h2>
        <p className="text-sm text-slate-500 text-center max-w-sm">
          Cette section est réservée aux responsables et administrateurs du Daara. Vous n'avez pas les droits nécessaires pour y accéder.
        </p>
      </div>
    );
  }

  const currentTabObj = TABS.find(t => t.id === activeTab);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">

      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-3xl bg-emerald-900 flex items-center justify-center shadow-md flex-shrink-0">
          <Settings className="w-6 h-6 text-emerald-200" />
        </div>
        <div>
          <h1 className="font-display font-black text-2xl text-slate-900">Réglages & Configuration</h1>
          <p className="text-xs text-slate-500 mt-0.5">Administration du Daara — Accès réservé aux Responsables</p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl">
          <Crown className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-amber-900">{currentUser?.role || 'Responsable'}</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 flex-wrap bg-slate-100 p-1.5 rounded-2xl">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-xs'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'general' && <TabGeneral appSettings={appSettings} updateAppSettings={updateAppSettings} showToast={showToast} />}
        {activeTab === 'security' && <TabSecurity appSettings={appSettings} updateAppSettings={updateAppSettings} showToast={showToast} />}
        {activeTab === 'kourels' && <TabKourels kourels={kourels} addKourel={addKourel} updateKourel={updateKourel} deleteKourel={deleteKourel} />}
        {activeTab === 'secteurs' && <TabSecteurs secteurs={secteurs} addSecteur={addSecteur} deleteSecteur={deleteSecteur} />}
        {activeTab === 'responsables' && <TabResponsables responsables={responsables} addResponsable={addResponsable} deleteResponsable={deleteResponsable} />}
      </div>

    </div>
  );
};
