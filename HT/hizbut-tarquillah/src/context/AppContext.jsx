import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  INITIAL_ZONES,
  INITIAL_KOURELS,
  INITIAL_SECTEURS,
  INITIAL_MEMBRES,
  INITIAL_KHASSIDAS,
  INITIAL_SONS_AUDIO,
  INITIAL_SEANCES,
  INITIAL_KAMIL_CYCLE,
  PAST_KAMIL_CYCLES,
  INITIAL_INFORMATIONS
} from '../mock/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Navigation & Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: 'u1',
    nom: 'Kara',
    prenom: 'Serigne Modou',
    role: 'Super Admin',
    email: 'admin@hizbut-tarquillah.sn'
  });
  const [activeTab, setActiveTab] = useState('accueil'); // accueil, dashboard, membres, repetition, kamil, info, login

  // Loading state for Supabase
  const [isLoading, setIsLoading] = useState(true);

  // State Entities
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [kourels, setKourels] = useState(INITIAL_KOURELS);
  const [secteurs, setSecteurs] = useState(INITIAL_SECTEURS);
  const [membres, setMembres] = useState(INITIAL_MEMBRES);
  const [khassidas, setKhassidas] = useState(INITIAL_KHASSIDAS);
  const [sonsAudio, setSonsAudio] = useState(INITIAL_SONS_AUDIO);
  const [seances, setSeances] = useState(INITIAL_SEANCES);
  const [kamilCycle, setKamilCycle] = useState(() => {
    try {
      const saved = localStorage.getItem('ht_kamil_cycle');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.assignations)) return parsed;
      }
    } catch (e) {}
    return INITIAL_KAMIL_CYCLE;
  });
  const [pastKamilCycles] = useState(PAST_KAMIL_CYCLES);

  // Synchronisation persistante du Cycle Kamil
  useEffect(() => {
    try {
      if (kamilCycle) {
        localStorage.setItem('ht_kamil_cycle', JSON.stringify(kamilCycle));
      }
    } catch (e) {}
  }, [kamilCycle]);
  const [informations, setInformations] = useState(INITIAL_INFORMATIONS);

  // Absence requests from members
  const [absenceRequests, setAbsenceRequests] = useState(() => {
    try {
      const saved = localStorage.getItem('ht_absence_requests');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [];
  });
  
  // App Settings & Customization
  const [appSettings, setAppSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('ht_app_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      daaraName: 'Sama daara',
      logoUrl: '',
      memberAccessCode: '188828',
      responsableAccessCode: '994201',
      theme: 'light'
    };
  });

  // Responsables list
  const [responsables, setResponsables] = useState(() => {
    try {
      const saved = localStorage.getItem('ht_responsables');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      { id: 'r1', prenom: 'Serigne Modou', nom: 'Kara', email: 'admin.modou@hizbut-tarquillah.sn', telephone: '+221 77 500 12 34', role: 'Super Admin', date_creation: '2021-01-15' },
      { id: 'r2', prenom: 'Cheikh Abdoulaye', nom: 'Diop', email: 'abdoulaye.diop@hizbut-tarquillah.sn', telephone: '+221 77 620 44 88', role: 'Superviseur Kourels', date_creation: '2022-03-20' },
      { id: 'r3', prenom: 'Moustapha', nom: 'Fall', email: 'moustapha.fall@hizbut-tarquillah.sn', telephone: '+221 77 811 90 22', role: 'Responsable Kamil & Audios', date_creation: '2023-05-10' }
    ];
  });

  // Apply theme to document element
  useEffect(() => {
    const isDark = appSettings.theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [appSettings.theme]);

  // Selected Member for Detail Drawer
  const [selectedMembreId, setSelectedMembreId] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  const updateAppSettings = (newSettings) => {
    setAppSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('ht_app_settings', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast('Réglages sauvegardés avec succès !');
  };

  // Kourel Actions
  const addKourel = async (kourelData) => {
    const newKourel = {
      id: 'k_' + Date.now(),
      nom: kourelData.nom || 'Nouveau Kourel',
      responsable: kourelData.responsable || 'À désigner',
      repetition_jour: kourelData.repetition_jour || 'Samedi 17h00',
      membres_count: 0
    };
    setKourels((prev) => [...prev, newKourel]);
    showToast(`Kourel « ${newKourel.nom} » ajouté avec succès !`);

    try {
      await supabase.from('kourels').insert([newKourel]);
    } catch (e) {
      console.error('Erreur Supabase addKourel:', e);
    }
  };

  const updateKourel = async (id, data) => {
    setKourels((prev) => prev.map(k => k.id === id ? { ...k, ...data } : k));
    showToast('Kourel mis à jour avec succès !');

    try {
      await supabase.from('kourels').update(data).eq('id', id);
    } catch (e) {
      console.error('Erreur Supabase updateKourel:', e);
    }
  };

  const deleteKourel = async (id) => {
    setKourels((prev) => prev.filter(k => k.id !== id));
    showToast('Kourel supprimé.', 'info');

    try {
      await supabase.from('kourels').delete().eq('id', id);
    } catch (e) {
      console.error('Erreur Supabase deleteKourel:', e);
    }
  };

  // Secteurs Actions
  const addSecteur = async (nom, description = '') => {
    const newSecteur = {
      id: 'sec_' + Date.now(),
      nom: nom.trim(),
      description: description.trim() || 'Commission opérationnelle de la Daara',
      membres_count: 0
    };
    setSecteurs((prev) => [...prev, newSecteur]);
    showToast(`Secteur « ${newSecteur.nom} » ajouté avec succès !`);

    try {
      await supabase.from('secteurs').insert([newSecteur]);
    } catch (e) {
      console.error('Erreur Supabase addSecteur:', e);
    }
  };

  const deleteSecteur = async (id) => {
    setSecteurs((prev) => prev.filter(s => s.id !== id));
    showToast('Secteur d\'activité supprimé.', 'info');

    try {
      await supabase.from('secteurs').delete().eq('id', id);
    } catch (e) {
      console.error('Erreur Supabase deleteSecteur:', e);
    }
  };

  // Responsables Actions
  const addResponsable = (data) => {
    const newResp = {
      id: 'resp_' + Date.now(),
      prenom: data.prenom || '',
      nom: data.nom || '',
      email: data.email || '',
      telephone: data.telephone || '',
      role: data.role || 'Responsable',
      date_creation: new Date().toISOString().split('T')[0]
    };
    setResponsables((prev) => {
      const updated = [...prev, newResp];
      try { localStorage.setItem('ht_responsables', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    showToast(`Responsable ${newResp.prenom} ${newResp.nom} ajouté avec succès !`);
  };

  const deleteResponsable = (id) => {
    setResponsables((prev) => {
      const updated = prev.filter(r => r.id !== id);
      try { localStorage.setItem('ht_responsables', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    showToast('Responsable supprimé.', 'info');
  };

  // Initial Fetch from Supabase
  useEffect(() => {
    const fetchDataFromSupabase = async () => {
      try {
        setIsLoading(true);

        const [
          { data: dbZones },
          { data: dbKourels },
          { data: dbSecteurs },
          { data: dbMembres },
          { data: dbKhassidas },
          { data: dbSons },
          { data: dbSeances },
          { data: dbPresences },
          { data: dbCycles },
          { data: dbAssignations },
          { data: dbInfos }
        ] = await Promise.all([
          supabase.from('zones').select('*'),
          supabase.from('kourels').select('*'),
          supabase.from('secteurs').select('*'),
          supabase.from('membres').select('*'),
          supabase.from('khassidas').select('*'),
          supabase.from('sons_audio').select('*'),
          supabase.from('seances').select('*'),
          supabase.from('presences').select('*'),
          supabase.from('kamil_cycles').select('*'),
          supabase.from('juz_assignations').select('*'),
          supabase.from('informations').select('*')
        ]);

        if (dbZones && dbZones.length > 0) setZones(dbZones);
        if (dbKourels && dbKourels.length > 0) setKourels(dbKourels);
        if (dbSecteurs && dbSecteurs.length > 0) setSecteurs(dbSecteurs);
        if (dbMembres && dbMembres.length > 0) setMembres(dbMembres);
        if (dbKhassidas && dbKhassidas.length > 0) setKhassidas(dbKhassidas);
        if (dbSons && dbSons.length > 0) setSonsAudio(dbSons);
        if (dbInfos && dbInfos.length > 0) setInformations(dbInfos);

        if (dbSeances && dbSeances.length > 0) {
          const formattedSeances = dbSeances.map((s) => {
            const seancePresences = (dbPresences || [])
              .filter((p) => p.seance_id === s.id)
              .map((p) => ({
                membre_id: p.membre_id,
                statut: p.statut,
                heure_arrivee: p.heure_arrivee || '',
                justifie: !!p.justifie
              }));
            return { ...s, presences: seancePresences };
          });
          setSeances(formattedSeances);
        }

        if (dbCycles && dbCycles.length > 0) {
          const activeCycle = dbCycles.find((c) => c.statut === 'En cours') || dbCycles[0];
          const cycleAssignations = (dbAssignations || [])
            .filter((a) => a.cycle_id === activeCycle.id)
            .sort((a, b) => a.juz - b.juz);
          
          setKamilCycle({
            ...activeCycle,
            assignations: cycleAssignations.length > 0 ? cycleAssignations : INITIAL_KAMIL_CYCLE.assignations
          });
        }
      } catch (err) {
        console.error('Erreur de chargement Supabase, fallback sur données locales:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDataFromSupabase();
  }, []);

  // Auth actions
  const login = (identifier, password, profileData = {}) => {
    setIsAuthenticated(true);
    
    // Check if role is Responsable / Superviseur / Super Admin
    const isResponsable = profileData.role === 'responsable' || 
                          profileData.role === 'Super Admin' || 
                          profileData.role === 'superviseur' ||
                          (typeof identifier === 'string' && (identifier.toLowerCase().includes('resp') || identifier.toLowerCase().includes('admin')));

    if (isResponsable) {
      setCurrentUser({
        id: 'u1',
        nom: profileData.nom || 'Kara',
        prenom: profileData.prenom || 'Serigne Modou',
        role: 'Super Admin',
        email: profileData.email || 'admin@hizbut-tarquillah.sn',
        matricule: profileData.matricule || 'HT-RESP-001',
        telephone: profileData.telephone || '+221 77 500 12 34'
      });
      setActiveTab('dashboard'); // Redirects directly to Daara management dashboard
    } else {
      setCurrentUser({
        id: 'm2',
        nom: profileData.nom || 'Ndiaye',
        prenom: profileData.prenom || 'Cheikh',
        email: profileData.email || (typeof identifier === 'string' && identifier.includes('@') ? identifier : 'cheikh.ndiaye@hizbut-tarquillah.sn'),
        matricule: profileData.matricule || 'HT-MEM-0142',
        telephone: profileData.telephone || '+221 77 654 32 10',
        role: 'Membre',
        kourel_id: 'k1',
        cotisation_statut: 'À jour'
      });
      setActiveTab('accueil');
    }
    showToast('Connexion réussie. Bienvenue sur Sama daara !');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('login');
    showToast('Vous avez été déconnecté.', 'info');
  };

  // Membres Actions
  const addMembre = async (membreData) => {
    const newMembre = {
      ...membreData,
      id: 'm_' + Date.now(),
      statut: membreData.statut || 'Actif',
      date_adhesion: new Date().toISOString().split('T')[0]
    };
    setMembres((prev) => [newMembre, ...prev]);
    showToast(`Membre ${newMembre.prenom} ${newMembre.nom} ajouté avec succès !`);

    try {
      await supabase.from('membres').insert([newMembre]);
    } catch (e) {
      console.error('Erreur Supabase addMembre:', e);
    }
  };

  const deleteMembre = async (membreId) => {
    const target = membres.find(m => m.id === membreId);
    setMembres((prev) => prev.filter(m => m.id !== membreId));
    if (selectedMembreId === membreId) setSelectedMembreId(null);
    showToast(`Membre ${target ? target.prenom + ' ' + target.nom : ''} supprimé avec succès.`, 'info');

    try {
      await supabase.from('membres').delete().eq('id', membreId);
    } catch (e) {
      console.error('Erreur Supabase deleteMembre:', e);
    }
  };

  // ─── Cotisation Management Actions ─────────────────────────────────────────
  const toggleMembreCotisation = (membreId) => {
    setMembres((prev) =>
      prev.map((m) => {
        if (m.id === membreId) {
          const isCurrentlyRegle = m.cotisation_statut === 'À jour';
          const newStatut = isCurrentlyRegle ? 'En retard' : 'À jour';
          showToast && showToast(
            newStatut === 'À jour'
              ? `✅ ${m.prenom} ${m.nom} marqué en règle.`
              : `⚠️ ${m.prenom} ${m.nom} marqué en retard.`
          );
          return { ...m, cotisation_statut: newStatut };
        }
        return m;
      })
    );
  };

  const bulkUpdateCotisations = (enRegleMemberIds) => {
    const idSet = new Set(enRegleMemberIds);
    setMembres((prev) =>
      prev.map((m) => ({
        ...m,
        cotisation_statut: idSet.has(m.id) ? 'À jour' : 'En retard'
      }))
    );
    const regleCount = enRegleMemberIds.length;
    const retardCount = (membres?.length || 0) - regleCount;
    showToast && showToast(`✅ Cotisations enregistrées : ${regleCount} membre(s) en règle, ${Math.max(0, retardCount)} en retard.`);
  };

  // Seance Pointage Actions
  const addSeance = async (seanceData) => {
    const newSeance = {
      ...seanceData,
      id: 's_' + Date.now(),
      statut: seanceData.statut || 'En cours',
      presences: seanceData.presences || []
    };
    setSeances((prev) => [newSeance, ...prev]);
    showToast(`Nouvelle feuille de pointage créée pour la séance du ${newSeance.date} !`);

    try {
      const { presences, ...seanceDbFields } = newSeance;
      await supabase.from('seances').insert([seanceDbFields]);
    } catch (e) {
      console.error('Erreur Supabase addSeance:', e);
    }
    return newSeance;
  };

  const updatePointage = async (seanceId, membreId, newStatut, heureArrivee = '') => {
    let finalHeureArrivee = '';
    
    setSeances((prevSeances) =>
      prevSeances.map((s) => {
        if (s.id !== seanceId) return s;

        const existingPresenceIndex = s.presences.findIndex((p) => p.membre_id === membreId);
        let updatedPresences = [...s.presences];
        
        finalHeureArrivee = newStatut === 'En retard' 
          ? (heureArrivee || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })) 
          : (newStatut === 'Présent' ? s.heure_debut : '');

        if (existingPresenceIndex >= 0) {
          updatedPresences[existingPresenceIndex] = {
            ...updatedPresences[existingPresenceIndex],
            statut: newStatut,
            heure_arrivee: finalHeureArrivee
          };
        } else {
          updatedPresences.push({
            membre_id: membreId,
            statut: newStatut,
            heure_arrivee: finalHeureArrivee,
            justifie: false
          });
        }

        return { ...s, presences: updatedPresences };
      })
    );
    showToast(`Présence mise à jour : ${newStatut}`);

    try {
      await supabase.from('presences').upsert([{
        seance_id: seanceId,
        membre_id: membreId,
        statut: newStatut,
        heure_arrivee: finalHeureArrivee,
        justifie: false
      }], { onConflict: 'seance_id,membre_id' });
    } catch (e) {
      console.error('Erreur Supabase updatePointage:', e);
    }
  };

  const bulkUpdatePointage = async (seanceId, memberIds, newStatut) => {
    setSeances((prevSeances) =>
      prevSeances.map((s) => {
        if (s.id !== seanceId) return s;

        let updatedPresences = [...s.presences];
        memberIds.forEach((mId) => {
          const existingIndex = updatedPresences.findIndex((p) => p.membre_id === mId);
          const hArrivee = newStatut === 'En retard' ? '20:15' : (newStatut === 'Présent' ? s.heure_debut : '');
          if (existingIndex >= 0) {
            updatedPresences[existingIndex] = {
              ...updatedPresences[existingIndex],
              statut: newStatut,
              heure_arrivee: hArrivee
            };
          } else {
            updatedPresences.push({
              membre_id: mId,
              statut: newStatut,
              heure_arrivee: hArrivee,
              justifie: false
            });
          }
        });

        return { ...s, presences: updatedPresences };
      })
    );
    showToast(`Pointage rapide effectué : Tous marqués "${newStatut}" !`);

    try {
      const currentSeance = seances.find(s => s.id === seanceId);
      const rows = memberIds.map(mId => ({
        seance_id: seanceId,
        membre_id: mId,
        statut: newStatut,
        heure_arrivee: newStatut === 'En retard' ? '20:15' : (newStatut === 'Présent' ? (currentSeance?.heure_debut || '20:00') : ''),
        justifie: false
      }));
      await supabase.from('presences').upsert(rows, { onConflict: 'seance_id,membre_id' });
    } catch (e) {
      console.error('Erreur Supabase bulkUpdatePointage:', e);
    }
  };

  // Kamil Actions
  const claimJukis = (jukiNumbers, customMembre = null) => {
    if (!jukiNumbers || !Array.isArray(jukiNumbers) || jukiNumbers.length === 0) return;
    const target = customMembre || currentUser || { id: 'm2', prenom: 'Cheikh Ahmadou', nom: 'NDIAYE' };
    const membreId = target.id || 'm2';
    const membreNom = `${target.prenom || ''} ${target.nom || ''}`.trim() || 'Membre';

    setKamilCycle((prev) => {
      const currentAssignations = prev?.assignations || INITIAL_KAMIL_CYCLE.assignations;
      const updatedAssignations = currentAssignations.map((a) => {
        if (jukiNumbers.includes(a.juz)) {
          return {
            ...a,
            membre_id: membreId,
            membre_nom: membreNom,
            statut: 'En cours',
            date_assignee: new Date().toISOString().split('T')[0]
          };
        }
        return a;
      });
      const updatedCycle = {
        ...prev,
        assignations: updatedAssignations
      };
      try {
        localStorage.setItem('ht_kamil_cycle', JSON.stringify(updatedCycle));
      } catch (e) {}
      return updatedCycle;
    });

    showToast(`Félicitations ! Les Jukis ${jukiNumbers.join(', ')} vous ont été assignés.`);
  };

  const markJukiCompleted = (jukiNumber, membreId = null) => {
    setKamilCycle((prev) => {
      const currentAssignations = prev?.assignations || [];
      const updatedAssignations = currentAssignations.map((a) => {
        const matchesMembre = !membreId || a.membre_id === membreId;
        if (a.juz === jukiNumber && matchesMembre) {
          return {
            ...a,
            statut: 'Terminé',
            date_validee: new Date().toISOString().split('T')[0]
          };
        }
        return a;
      });
      const updatedCycle = {
        ...prev,
        assignations: updatedAssignations
      };
      try {
        localStorage.setItem('ht_kamil_cycle', JSON.stringify(updatedCycle));
      } catch (e) {}
      return updatedCycle;
    });

    showToast(`Barak'Allah fik ! Votre lecture du Juki ${jukiNumber} a été validée.`);
  };

  const updateJuzStatut = async (juzNumber, newStatut) => {
    const valideeDate = (newStatut === 'Terminé' || newStatut === 'Validé') ? new Date().toISOString().split('T')[0] : '';
    setKamilCycle((prev) => {
      const updated = {
        ...prev,
        assignations: prev.assignations.map((item) => {
          if (item.juz !== juzNumber) return item;
          return {
            ...item,
            statut: newStatut,
            date_validee: valideeDate
          };
        })
      };
      try {
        localStorage.setItem('ht_kamil_cycle', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    showToast(`Juki ${juzNumber} marqué comme "${newStatut}"`);

    try {
      if (kamilCycle?.id) {
        await supabase
          .from('juz_assignations')
          .update({ statut: newStatut, date_validee: valideeDate })
          .eq('cycle_id', kamilCycle.id)
          .eq('juz', juzNumber);
      }
    } catch (e) {
      console.error('Erreur Supabase updateJuzStatut:', e);
    }
  };

  const assignJuzToMembre = async (juzNumber, membreId) => {
    const m = membres.find((mem) => mem.id === membreId);
    const name = m ? `${m.prenom} ${m.nom}` : (membreId ? 'Membre' : '');
    const newStatut = membreId ? 'En cours' : 'À faire';

    setKamilCycle((prev) => {
      const updated = {
        ...prev,
        assignations: prev.assignations.map((item) => {
          if (item.juz !== juzNumber) return item;
          return { 
            ...item, 
            membre_id: membreId || null,
            membre_nom: name || null,
            statut: newStatut 
          };
        })
      };
      try {
        localStorage.setItem('ht_kamil_cycle', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (membreId) {
      showToast(`Juki ${juzNumber} attribué à ${name}`);
    } else {
      showToast(`Juki ${juzNumber} libéré`, 'info');
    }

    try {
      if (kamilCycle?.id) {
        await supabase
          .from('juz_assignations')
          .update({ membre_id: membreId, statut: newStatut })
          .eq('cycle_id', kamilCycle.id)
          .eq('juz', juzNumber);
      }
    } catch (e) {
      console.error('Erreur Supabase assignJuzToMembre:', e);
    }
  };

  const lancerNouveauCycle = async (dureeSemaines = 2, modeAssignation = 'auto') => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + (dureeSemaines * 7));

    const activeMembres = membres.filter(m => m.statut === 'Actif');
    const newCycleId = 'cycle-' + Date.now();
    const newCycleNum = (kamilCycle?.numero_cycle || 41) + 1;

    const newAssignations = Array.from({ length: 30 }, (_, i) => {
      const juzNum = i + 1;
      const assignedMembre = activeMembres[i % activeMembres.length];
      return {
        juz: juzNum,
        membre_id: assignedMembre ? assignedMembre.id : (membres[0]?.id || 'm1'),
        nom_juz: `Juz' ${juzNum}`,
        statut: 'À faire',
        date_validee: ''
      };
    });

    const newCycle = {
      id: newCycleId,
      numero_cycle: newCycleNum,
      date_debut: today.toISOString().split('T')[0],
      date_fin_prevue: endDate.toISOString().split('T')[0],
      statut: 'En cours',
      duree_semaines: dureeSemaines,
      assignations: newAssignations
    };

    setKamilCycle(newCycle);
    showToast(`Nouveau Cycle Kamil #${newCycle.numero_cycle} lancé avec succès !`);

    try {
      const { assignations, ...cycleFields } = newCycle;
      await supabase.from('kamil_cycles').insert([cycleFields]);
      
      const dbAssignations = assignations.map(a => ({
        cycle_id: newCycleId,
        juz: a.juz,
        membre_id: a.membre_id,
        nom_juz: a.nom_juz,
        statut: a.statut,
        date_validee: a.date_validee
      }));
      await supabase.from('juz_assignations').insert(dbAssignations);
    } catch (e) {
      console.error('Erreur Supabase lancerNouveauCycle:', e);
    }
  };

  // Information Actions
  const addInformation = async (infoData) => {
    const newInfo = {
      ...infoData,
      id: 'inf_' + Date.now(),
      date_publication: new Date().toISOString().split('T')[0],
      auteur: currentUser.prenom + ' ' + currentUser.nom
    };
    setInformations((prev) => [newInfo, ...prev]);
    showToast('Actualité publiée avec succès !');

    try {
      await supabase.from('informations').insert([newInfo]);
    } catch (e) {
      console.error('Erreur Supabase addInformation:', e);
    }
  };

  const togglePinInformation = async (infoId) => {
    const target = informations.find(i => i.id === infoId);
    const newPinned = !target?.epingle;
    setInformations((prev) =>
      prev.map((item) => (item.id === infoId ? { ...item, epingle: newPinned } : item))
    );
    showToast('Statut d\'épinglage modifié.');

    try {
      await supabase.from('informations').update({ epingle: newPinned }).eq('id', infoId);
    } catch (e) {
      console.error('Erreur Supabase togglePinInformation:', e);
    }
  };

  // Zone Actions
  const updateMembreZone = async (membreId, newZoneId) => {
    setMembres((prev) =>
      prev.map((m) => (m.id === membreId ? { ...m, zone_id: newZoneId } : m))
    );
    const z = zones.find((z) => z.id === newZoneId);
    showToast(`Membre réaffecté à : ${z ? z.nom : 'Non affecté'}`);

    try {
      await supabase.from('membres').update({ zone_id: newZoneId }).eq('id', membreId);
    } catch (e) {
      console.error('Erreur Supabase updateMembreZone:', e);
    }
  };

  const bulkUpdateMembreZone = async (membreIds, newZoneId) => {
    setMembres((prev) =>
      prev.map((m) => (membreIds.includes(m.id) ? { ...m, zone_id: newZoneId } : m))
    );
    const z = zones.find((z) => z.id === newZoneId);
    showToast(`${membreIds.length} membre(s) réaffecté(s) à : ${z ? z.nom : 'Non affecté'}`);

    try {
      await supabase.from('membres').update({ zone_id: newZoneId }).in('id', membreIds);
    } catch (e) {
      console.error('Erreur Supabase bulkUpdateMembreZone:', e);
    }
  };

  const updateZoneResponsable = async (zoneId, newResponsable) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, responsable: newResponsable } : z))
    );
    showToast('Superviseur de la zone mis à jour avec succès.');

    try {
      await supabase.from('zones').update({ responsable: newResponsable }).eq('id', zoneId);
    } catch (e) {
      console.error('Erreur Supabase updateZoneResponsable:', e);
    }
  };

  const addZone = async (zoneData) => {
    const newZone = {
      ...zoneData,
      id: 'z_' + Date.now(),
      code: zoneData.code || `Z-CUSTOM-${zones.length + 1}`,
      couleur: zoneData.couleur || 'emerald'
    };
    setZones((prev) => [...prev, newZone]);
    showToast(`Zone "${newZone.nom}" créée avec succès !`);

    try {
      await supabase.from('zones').insert([newZone]);
    } catch (e) {
      console.error('Erreur Supabase addZone:', e);
    }
  };

  const deleteZone = async (zoneId) => {
    const target = zones.find((z) => z.id === zoneId);
    setZones((prev) => prev.filter((z) => z.id !== zoneId));
    setMembres((prev) =>
      prev.map((m) => (m.zone_id === zoneId ? { ...m, zone_id: '' } : m))
    );
    showToast(`Zone "${target ? target.nom : ''}" supprimée.`, 'info');

    try {
      await supabase.from('zones').delete().eq('id', zoneId);
    } catch (e) {
      console.error('Erreur Supabase deleteZone:', e);
    }
  };

  // Khassidas actions
  const addKhassida = async (khassidaData) => {
    const newKhassida = {
      ...khassidaData,
      id: 'kh_' + Date.now(),
      auteur: khassidaData.auteur || 'Cheikh Ahmadou Bamba',
      duree_estimee: khassidaData.duree_estimee || '20 min',
      versets_count: Number(khassidaData.versets_count) || 100
    };
    setKhassidas((prev) => [newKhassida, ...prev]);
    showToast(`Khassida "${newKhassida.titre}" ajoutée au programme avec succès !`);

    try {
      await supabase.from('khassidas').insert([newKhassida]);
    } catch (e) {
      console.error('Erreur Supabase addKhassida:', e);
    }
  };

  const deleteKhassida = async (id) => {
    const target = khassidas.find((kh) => kh.id === id);
    setKhassidas((prev) => prev.filter((kh) => kh.id !== id));
    showToast(`Khassida "${target ? target.titre : ''}" supprimée du programme.`, 'info');

    try {
      await supabase.from('khassidas').delete().eq('id', id);
    } catch (e) {
      console.error('Erreur Supabase deleteKhassida:', e);
    }
  };

  // Sons Audio actions
  const addSonAudio = async (sonData) => {
    const newSon = {
      ...sonData,
      id: 'son_' + Date.now(),
      date_enregistrement: new Date().toISOString().split('T')[0],
      qualite: sonData.qualite || 'HQ 320 kbps',
      taille: sonData.taille || '15.0 Mo'
    };
    setSonsAudio((prev) => [newSon, ...prev]);
    showToast(`Audio de référence "${newSon.titre}" ajouté avec succès !`);

    try {
      await supabase.from('sons_audio').insert([newSon]);
    } catch (e) {
      console.error('Erreur Supabase addSonAudio:', e);
    }
  };

  const deleteSonAudio = async (id) => {
    const target = sonsAudio.find((s) => s.id === id);
    setSonsAudio((prev) => prev.filter((s) => s.id !== id));
    showToast(`Audio de référence "${target ? target.titre : ''}" supprimé.`, 'info');

    try {
      await supabase.from('sons_audio').delete().eq('id', id);
    } catch (e) {
      console.error('Erreur Supabase deleteSonAudio:', e);
    }
  };

  // Secteurs de travail actions
  const updateMembreSecteur = async (membreId, newSecteurId) => {
    setMembres((prev) =>
      prev.map((m) => (m.id === membreId ? { ...m, secteur_id: newSecteurId } : m))
    );
    const sec = secteurs.find((s) => s.id === newSecteurId);
    showToast(`Secteur mis à jour : ${sec ? sec.nom : 'Non affecté'}`);

    try {
      await supabase.from('membres').update({ secteur_id: newSecteurId }).eq('id', membreId);
    } catch (e) {
      console.error('Erreur Supabase updateMembreSecteur:', e);
    }
  };

  const bulkAssignSecteur = async (membreIds, newSecteurId) => {
    setMembres((prev) =>
      prev.map((m) => (membreIds.includes(m.id) ? { ...m, secteur_id: newSecteurId } : m))
    );
    const sec = secteurs.find((s) => s.id === newSecteurId);
    showToast(`${membreIds.length} membre(s) affecté(s) au secteur : ${sec ? sec.nom : 'Non affecté'}`);

    try {
      await supabase.from('membres').update({ secteur_id: newSecteurId }).in('id', membreIds);
    } catch (e) {
      console.error('Erreur Supabase bulkAssignSecteur:', e);
    }
  };

  // ─── Absence Requests ──────────────────────────────────────────────────────
  const addAbsenceRequest = (request) => {
    const newRequest = {
      id: `abs_${Date.now()}`,
      membre_id: currentUser?.id || 'unknown',
      membre_nom: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Inconnu',
      kourel_id: currentUser?.kourel_id || '',
      date_soumission: new Date().toISOString().split('T')[0],
      statut: 'En attente',
      ...request
    };
    setAbsenceRequests(prev => {
      const updated = [newRequest, ...prev];
      try { localStorage.setItem('ht_absence_requests', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    showToast('✅ Votre demande d\'absence a été soumise avec succès.');
  };

  const updateAbsenceRequest = (id, updates) => {
    setAbsenceRequests(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      try { localStorage.setItem('ht_absence_requests', JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
  };

  return (
    <AppContext.Provider
      value={{
        isLoading,
        isAuthenticated,
        setIsAuthenticated,
        currentUser,
        setCurrentUser,
        activeTab,
        setActiveTab,
        zones,
        kourels,
        secteurs,
        membres,
        khassidas,
        sonsAudio,
        seances,
        kamilCycle,
        setKamilCycle,
        pastKamilCycles,
        claimJukis,
        markJukiCompleted,
        informations,
        selectedMembreId,
        setSelectedMembreId,
        toast,
        showToast,
        login,
        logout,
        addMembre,
        deleteMembre,
        addSeance,
        updatePointage,
        bulkUpdatePointage,
        updateJuzStatut,
        assignJuzToMembre,
        lancerNouveauCycle,
        addInformation,
        togglePinInformation,
        updateMembreZone,
        bulkUpdateMembreZone,
        updateZoneResponsable,
        addZone,
        deleteZone,
        addKhassida,
        deleteKhassida,
        addSonAudio,
        deleteSonAudio,
        updateMembreSecteur,
        bulkAssignSecteur,
        appSettings,
        updateAppSettings,
        addKourel,
        updateKourel,
        deleteKourel,
        addSecteur,
        deleteSecteur,
        responsables,
        addResponsable,
        deleteResponsable,
        absenceRequests,
        addAbsenceRequest,
        updateAbsenceRequest,
        toggleMembreCotisation,
        bulkUpdateCotisations
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
