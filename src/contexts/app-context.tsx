
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'patient' | 'medecin' | null;

export interface PatientRecordServerResponse { // Structure attendue du backend
  id: string; // Devrait correspondre à _id de MongoDB
  doctorId: string;
  patientFirstName: string;
  patientLastName: string;
  patientDOB: string; // ISO String date
  patientSex: string;
  disease: string;
  notes: string;
  createdAt: string; // ISO String date
  updatedAt: string; // ISO String date
}

export interface PatientRecordInput { // Données pour créer un enregistrement
  patientFirstName: string;
  patientLastName:string;
  patientDOB: string;
  patientSex: string;
  disease: string;
  notes: string;
  // doctorId sera ajouté côté backend à partir de l'utilisateur authentifié
}


export interface DocumentVote {
  [documentUrl: string]: boolean; 
}

export interface PatientVoteStore {
  [patientId: string]: DocumentVote;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  // Fonctions modifiées pour simuler des appels API
  addPatientRecord: (recordInput: PatientRecordInput) => Promise<PatientRecordServerResponse | null>;
  getPatientRecordById: (id: string) => Promise<PatientRecordServerResponse | null>;
  getPatientRecords: () => Promise<PatientRecordServerResponse[]>; // Nouvelle fonction pour lister
  documentVotes: PatientVoteStore;
  toggleDocumentVote: (patientId: string, documentUrl: string) => void;
  hasVoted: (patientId: string, documentUrl: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  // patientRecords n'est plus stocké ici
  const [documentVotes, setDocumentVotes] = useState<PatientVoteStore>({});

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
    // TODO: Lorsqu'une vraie authentification sera en place,
    // changer de rôle pourrait impliquer de vider les données spécifiques à l'ancien rôle.
  }, []);

  const addPatientRecord = useCallback(async (recordInput: PatientRecordInput): Promise<PatientRecordServerResponse | null> => {
    console.log('[AppContext] addPatientRecord appelé avec:', recordInput);
    // TODO: Implémenter l'appel API backend ici
    // Exemple:
    // try {
    //   const response = await fetch('/api/patient-records', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(recordInput),
    //   });
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Erreur lors de la création de la fiche patient.');
    //   }
    //   return await response.json();
    // } catch (error) {
    //   console.error("Erreur dans addPatientRecord:", error);
    //   throw error; // Relancer pour que le composant puisse gérer
    // }
    alert('Simulation: Appel à addPatientRecord. Vérifiez la console. Implémentez l\'appel API réel.');
    // Pour la simulation, retournons une structure de réponse attendue:
    const mockRecord: PatientRecordServerResponse = {
      id: Date.now().toString(),
      doctorId: 'mockDoctorId', // Ceci devrait venir de l'utilisateur authentifié côté backend
      ...recordInput,
      patientDOB: new Date(recordInput.patientDOB).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Ne pas stocker dans l'état local, le backend est la source de vérité.
    // Cette fonction ne doit que faire l'appel et retourner la réponse.
    return mockRecord; // Ou null si l'API échoue, après avoir géré l'erreur
  }, []);

  const getPatientRecordById = useCallback(async (id: string): Promise<PatientRecordServerResponse | null> => {
    console.log('[AppContext] getPatientRecordById appelé pour id:', id);
    // TODO: Implémenter l'appel API backend ici
    // Exemple:
    // try {
    //   const response = await fetch(`/api/patient-records/${id}`);
    //   if (!response.ok) {
    //     if (response.status === 404) return null; // Non trouvé
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Erreur lors de la récupération de la fiche patient.');
    //   }
    //   return await response.json();
    // } catch (error) {
    //   console.error("Erreur dans getPatientRecordById:", error);
    //   throw error;
    // }
    alert(`Simulation: Appel à getPatientRecordById pour ${id}. Vérifiez la console. Implémentez l\'appel API réel.`);
    return null; // Simule une non-récupération ou une attente de l'implémentation
  }, []);

  const getPatientRecords = useCallback(async (): Promise<PatientRecordServerResponse[]> => {
    console.log('[AppContext] getPatientRecords appelé.');
    // TODO: Implémenter l'appel API backend ici pour lister les fiches
    // (potentiellement filtrées par doctorId si nécessaire, géré côté backend)
    // Exemple:
    // try {
    //   const response = await fetch('/api/patient-records'); // Pourrait nécessiter l'ID du médecin
    //   if (!response.ok) {
    //     const errorData = await response.json();
    //     throw new Error(errorData.message || 'Erreur lors de la récupération des fiches patients.');
    //   }
    //   return await response.json();
    // } catch (error) {
    //   console.error("Erreur dans getPatientRecords:", error);
    //   throw error;
    // }
    alert('Simulation: Appel à getPatientRecords. Vérifiez la console. Implémentez l\'appel API réel.');
    return []; // Simule une liste vide ou une attente de l'implémentation
  }, []);


  const toggleDocumentVote = useCallback((patientId: string, documentUrl: string) => {
    setDocumentVotes(prevVotes => {
      const patientSpecificVotes = prevVotes[patientId] || {};
      const newPatientSpecificVotes = { ...patientSpecificVotes };
      if (newPatientSpecificVotes[documentUrl]) {
        delete newPatientSpecificVotes[documentUrl]; 
      } else {
        newPatientSpecificVotes[documentUrl] = true; 
      }
      // TODO: Idéalement, les votes devraient aussi être persistés au backend.
      // Pour l'instant, ils restent en mémoire.
      console.log(`[AppContext] Vote pour document ${documentUrl} (patient ${patientId}) basculé. Ceci est en mémoire.`);
      return {
        ...prevVotes,
        [patientId]: newPatientSpecificVotes,
      };
    });
  }, []);

  const hasVoted = useCallback((patientId: string, documentUrl: string) => {
    return !!(documentVotes[patientId] && documentVotes[patientId][documentUrl]);
  }, [documentVotes]);

  return (
    <AppContext.Provider value={{ 
      userRole, 
      setUserRole, 
      addPatientRecord, 
      getPatientRecordById,
      getPatientRecords,
      documentVotes,
      toggleDocumentVote,
      hasVoted
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
