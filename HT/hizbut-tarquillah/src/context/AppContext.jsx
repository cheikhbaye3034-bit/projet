import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_ZONES,
  INITIAL_KOURELS,
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

  // State Entities
  const [zones, setZones] = useState(INITIAL_ZONES);
  const [kourels, setKourels] = useState(INITIAL_KOURELS);
  const [membres, setMembres] = useState(INITIAL_MEMBRES);
  const [khassidas] = useState(INITIAL_KHASSIDAS);
  const [sonsAudio] = useState(INITIAL_SONS_AUDIO);
  const [seances, setSeances] = useState(INITIAL_SEANCES);
  const [kamilCycle, setKamilCycle] = useState(INITIAL_KAMIL_CYCLE);
  const [pastKamilCycles] = useState(PAST_KAMIL_CYCLES);
  const [informations, setInformations] = useState(INITIAL_INFORMATIONS);
  
  // Selected Member for Detail Drawer
  const [selectedMembreId, setSelectedMembreId] = useState(null);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth actions
  const login = (identifier, password) => {
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    showToast('Connexion réussie. Bienvenue sur Hizbut-Tarqiyyah !');
  };

  const logout = () => {
    setIsAuthenticated(false);
    setActiveTab('login');
    showToast('Vous avez été déconnecté.', 'info');
  };

  // Membres Actions
  const addMembre = (membreData) => {
    const newMembre = {
      ...membreData,
      id: 'm_' + Date.now(),
      statut: membreData.statut || 'Actif',
      date_adhesion: new Date().toISOString().split('T')[0]
    };
    setMembres((prev) => [newMembre, ...prev]);
    showToast(`Membre ${newMembre.prenom} ${newMembre.nom} ajouté avec succès !`);
  };

  const deleteMembre = (membreId) => {
    const target = membres.find(m => m.id === membreId);
    setMembres((prev) => prev.filter(m => m.id !== membreId));
    if (selectedMembreId === membreId) setSelectedMembreId(null);
    showToast(`Membre ${target ? target.prenom + ' ' + target.nom : ''} supprimé avec succès.`, 'info');
  };

  // Seance Pointage Actions
  const updatePointage = (seanceId, membreId, newStatut, heureArrivee = '') => {
    setSeances((prevSeances) =>
      prevSeances.map((s) => {
        if (s.id !== seanceId) return s;

        const existingPresenceIndex = s.presences.findIndex((p) => p.membre_id === membreId);
        let updatedPresences = [...s.presences];

        if (existingPresenceIndex >= 0) {
          updatedPresences[existingPresenceIndex] = {
            ...updatedPresences[existingPresenceIndex],
            statut: newStatut,
            heure_arrivee: newStatut === 'En retard' ? (heureArrivee || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })) : (newStatut === 'Présent' ? s.heure_debut : '')
          };
        } else {
          updatedPresences.push({
            membre_id: membreId,
            statut: newStatut,
            heure_arrivee: newStatut === 'En retard' ? heureArrivee : (newStatut === 'Présent' ? s.heure_debut : ''),
            justifie: false
          });
        }

        return { ...s, presences: updatedPresences };
      })
    );
    showToast(`Présence mise à jour : ${newStatut}`);
  };

  // Kamil Actions
  const updateJuzStatut = (juzNumber, newStatut) => {
    setKamilCycle((prev) => ({
      ...prev,
      assignations: prev.assignations.map((item) => {
        if (item.juz !== juzNumber) return item;
        return {
          ...item,
          statut: newStatut,
          date_validee: newStatut === 'Terminé' ? new Date().toISOString().split('T')[0] : item.date_validee
        };
      })
    }));
    showToast(`Juz' ${juzNumber} marqué comme "${newStatut}"`);
  };

  const assignJuzToMembre = (juzNumber, membreId) => {
    setKamilCycle(prev => ({
      ...prev,
      assignations: prev.assignations.map(item => {
        if (item.juz !== juzNumber) return item;
        return { ...item, membre_id: membreId };
      })
    }));
    const m = membres.find(mem => mem.id === membreId);
    const name = m ? `${m.prenom} ${m.nom}` : 'Membre';
    showToast(`Juki ${juzNumber} attribué à ${name}`);
  };

  const lancerNouveauCycle = (dureeSemaines = 2, modeAssignation = 'auto') => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + (dureeSemaines * 7));

    const activeMembres = membres.filter(m => m.statut === 'Actif');

    const newAssignations = Array.from({ length: 30 }, (_, i) => {
      const juzNum = i + 1;
      const assignedMembre = activeMembres[i % activeMembres.length];
      return {
        juz: juzNum,
        membre_id: assignedMembre ? assignedMembre.id : membres[0].id,
        nom_juz: `Juz' ${juzNum}`,
        statut: 'À faire',
        date_validee: ''
      };
    });

    const newCycle = {
      id: 'cycle-' + Date.now(),
      numero_cycle: kamilCycle.numero_cycle + 1,
      date_debut: today.toISOString().split('T')[0],
      date_fin_prevue: endDate.toISOString().split('T')[0],
      statut: 'En cours',
      duree_semaines: dureeSemaines,
      assignations: newAssignations
    };

    setKamilCycle(newCycle);
    showToast(`Nouveau Cycle Kamil #${newCycle.numero_cycle} lancé avec succès !`);
  };

  // Information Actions
  const addInformation = (infoData) => {
    const newInfo = {
      ...infoData,
      id: 'inf_' + Date.now(),
      date_publication: new Date().toISOString().split('T')[0],
      auteur: currentUser.prenom + ' ' + currentUser.nom
    };
    setInformations((prev) => [newInfo, ...prev]);
    showToast('Actualité publiée avec succès !');
  };

  const togglePinInformation = (infoId) => {
    setInformations((prev) =>
      prev.map((item) => (item.id === infoId ? { ...item, epingle: !item.epingle } : item))
    );
    showToast('Statut d\'épinglage modifié.');
  };

  // Zone Actions
  const updateMembreZone = (membreId, newZoneId) => {
    setMembres((prev) =>
      prev.map((m) => (m.id === membreId ? { ...m, zone_id: newZoneId } : m))
    );
    const z = zones.find((z) => z.id === newZoneId);
    showToast(`Membre réaffecté à : ${z ? z.nom : 'Non affecté'}`);
  };

  const bulkUpdateMembreZone = (membreIds, newZoneId) => {
    setMembres((prev) =>
      prev.map((m) => (membreIds.includes(m.id) ? { ...m, zone_id: newZoneId } : m))
    );
    const z = zones.find((z) => z.id === newZoneId);
    showToast(`${membreIds.length} membre(s) réaffecté(s) à : ${z ? z.nom : 'Non affecté'}`);
  };

  const updateZoneResponsable = (zoneId, newResponsable) => {
    setZones((prev) =>
      prev.map((z) => (z.id === zoneId ? { ...z, responsable: newResponsable } : z))
    );
    showToast('Superviseur de la zone mis à jour avec succès.');
  };

  const addZone = (zoneData) => {
    const newZone = {
      ...zoneData,
      id: 'z_' + Date.now(),
      code: zoneData.code || `Z-CUSTOM-${zones.length + 1}`,
      couleur: zoneData.couleur || 'emerald'
    };
    setZones((prev) => [...prev, newZone]);
    showToast(`Zone "${newZone.nom}" créée avec succès !`);
  };

  const deleteZone = (zoneId) => {
    const target = zones.find((z) => z.id === zoneId);
    setZones((prev) => prev.filter((z) => z.id !== zoneId));
    setMembres((prev) =>
      prev.map((m) => (m.zone_id === zoneId ? { ...m, zone_id: '' } : m))
    );
    showToast(`Zone "${target ? target.nom : ''}" supprimée.`, 'info');
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        activeTab,
        setActiveTab,
        zones,
        kourels,
        membres,
        khassidas,
        sonsAudio,
        seances,
        kamilCycle,
        pastKamilCycles,
        informations,
        selectedMembreId,
        setSelectedMembreId,
        toast,
        showToast,
        login,
        logout,
        addMembre,
        deleteMembre,
        updatePointage,
        updateJuzStatut,
        assignJuzToMembre,
        lancerNouveauCycle,
        addInformation,
        togglePinInformation,
        updateMembreZone,
        bulkUpdateMembreZone,
        updateZoneResponsable,
        addZone,
        deleteZone
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
