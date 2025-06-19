
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'patient' | 'medecin' | null;

// Structure pour les données envoyées au backend pour la création/mise à jour
export interface PatientRecordInput { 
  patientFirstName: string;
  patientLastName:string;
  patientDOB: string; // Sera une string (ex: "YYYY-MM-DD") depuis le formulaire
  patientSex: string;
  disease: string;
  notes: string;
  // doctorId sera géré côté backend (à partir de l'utilisateur authentifié)
}

// Structure pour les données reçues du backend
export interface PatientRecordServerResponse { 
  id: string; // Correspond à _id de MongoDB, converti en string
  doctorId: string; // Converti en string si c'est un ObjectId dans la DB
  patientFirstName: string;
  patientLastName: string;
  patientDOB: string; // Doit être une string ISO (ex: "2023-10-26T00:00:00.000Z")
  patientSex: string;
  disease: string;
  notes: string;
  createdAt: string; // String ISO
  updatedAt: string; // String ISO
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
  addPatientRecord: (recordInput: PatientRecordInput) => Promise<PatientRecordServerResponse | null>;
  getPatientRecordById: (id: string) => Promise<PatientRecordServerResponse | null>;
  getPatientRecords: () => Promise<PatientRecordServerResponse[]>;
  documentVotes: PatientVoteStore;
  toggleDocumentVote: (patientId: string, documentUrl: string) => void;
  hasVoted: (patientId: string, documentUrl: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [documentVotes, setDocumentVotes] = useState<PatientVoteStore>({});

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
  }, []);

  const addPatientRecord = useCallback(async (recordInput: PatientRecordInput): Promise<PatientRecordServerResponse | null> => {
    console.log('[AppContext] addPatientRecord appelé avec:', recordInput);
    try {
      const response = await fetch('/api/patient-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordInput),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur non-JSON lors de la création.' }));
        console.error('Erreur API (addPatientRecord):', response.status, errorData);
        throw new Error(errorData.message || `Erreur ${response.status} lors de la création de la fiche patient.`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur dans addPatientRecord (AppContext):", error);
      // Pour que le composant puisse afficher l'erreur, relancez-la ou retournez une valeur qui l'indique.
      // Dans ce cas, le composant gère déjà l'erreur si la promesse est rejetée.
      throw error;
    }
  }, []);

  const getPatientRecordById = useCallback(async (id: string): Promise<PatientRecordServerResponse | null> => {
    console.log('[AppContext] getPatientRecordById appelé pour id:', id);
    if (!id) {
        console.warn('[AppContext] getPatientRecordById: ID non fourni.');
        return null;
    }
    try {
      const response = await fetch(`/api/patient-records/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null; // Non trouvé
        const errorData = await response.json().catch(() => ({ message: 'Erreur non-JSON lors de la récupération.' }));
        console.error('Erreur API (getPatientRecordById):', response.status, errorData);
        throw new Error(errorData.message || `Erreur ${response.status} lors de la récupération de la fiche patient.`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erreur dans getPatientRecordById pour ${id} (AppContext):`, error);
      throw error;
    }
  }, []);

  const getPatientRecords = useCallback(async (): Promise<PatientRecordServerResponse[]> => {
    console.log('[AppContext] getPatientRecords appelé.');
    try {
      const response = await fetch('/api/patient-records');
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur non-JSON lors de la listage.' }));
        console.error('Erreur API (getPatientRecords):', response.status, errorData);
        throw new Error(errorData.message || `Erreur ${response.status} lors de la récupération des fiches patients.`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur dans getPatientRecords (AppContext):", error);
      throw error;
    }
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
