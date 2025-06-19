
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

  // Simule l'ajout d'un dossier patient via une API backend
  const addPatientRecord = useCallback(async (recordInput: PatientRecordInput): Promise<PatientRecordServerResponse | null> => {
    console.log('[AppContext] addPatientRecord appelé avec (API):', recordInput);
    try {
      const response = await fetch('/api/patient-records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(recordInput),
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Erreur ${response.statusText || response.status} lors de la création. Réponse non-JSON.` }));
        console.error('Erreur API (addPatientRecord):', response.status, errorData);
        const backendErrorMessage = errorData.error ? ` Détail: ${errorData.error}` : '';
        throw new Error(`${errorData.message || `Erreur ${response.status} lors de la création de la fiche patient.`}${backendErrorMessage}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Erreur dans addPatientRecord (AppContext):", error);
      throw error; // Relancer pour que le composant puisse gérer
    }
  }, []);

  // Simule la récupération d'un dossier patient par ID depuis une API backend
  const getPatientRecordById = useCallback(async (id: string): Promise<PatientRecordServerResponse | null> => {
    console.log('[AppContext] getPatientRecordById appelé pour id (API):', id);
    if (!id) {
        console.warn('[AppContext] getPatientRecordById: ID non fourni.');
        return null;
    }
    try {
      const response = await fetch(`/api/patient-records/${id}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        const errorData = await response.json().catch(() => ({ message: `Erreur ${response.statusText || response.status} lors de la récupération. Réponse non-JSON.` }));
        console.error('Erreur API (getPatientRecordById):', response.status, errorData);
        const backendErrorMessage = errorData.error ? ` Détail: ${errorData.error}` : '';
        throw new Error(`${errorData.message || `Erreur ${response.status} lors de la récupération de la fiche patient.`}${backendErrorMessage}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Erreur dans getPatientRecordById pour ${id} (AppContext):`, error);
      throw error;
    }
  }, []);

  // Simule la récupération de tous les dossiers patients depuis une API backend
  const getPatientRecords = useCallback(async (): Promise<PatientRecordServerResponse[]> => {
    console.log('[AppContext] getPatientRecords appelé (API).');
    try {
      const response = await fetch('/api/patient-records');
      if (!response.ok) {
        // Tentative de parser le JSON pour obtenir un message d'erreur plus précis du backend
        const errorData = await response.json().catch(() => ({ 
            message: `Erreur ${response.statusText || response.status} lors de la récupération des fiches. Réponse non-JSON.`,
            error: null // Assure que errorData.error existe
        }));
        console.error('Erreur API (getPatientRecords):', response.status, errorData);
        // Construit un message d'erreur plus informatif si errorData.error (venant du backend) est disponible
        const backendSpecificError = errorData.error ? String(errorData.error) : null;
        const primaryMessage = errorData.message || `Erreur ${response.status} lors de la récupération des fiches patients.`;
        
        let fullErrorMessage = primaryMessage;
        if (backendSpecificError && primaryMessage.toLowerCase().includes('internal server error')) {
          // Si le message principal est générique et qu'un détail backend existe, préférer ou ajouter le détail
          fullErrorMessage = `Erreur serveur: ${backendSpecificError} (Message original: ${primaryMessage})`;
        } else if (backendSpecificError) {
          fullErrorMessage = `${primaryMessage} (Détail: ${backendSpecificError})`;
        }
        
        throw new Error(fullErrorMessage);
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
