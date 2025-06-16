
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';

export type UserRole = 'patient' | 'medecin' | null;

export interface PatientRecord {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  sex: string;
  disease: string;
  notes: string;
  createdAt: string;
}

export interface DocumentVote {
  [documentUrl: string]: boolean; // true for upvote, could be extended
}

export interface PatientVoteStore {
  [patientId: string]: DocumentVote;
}

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  patientRecords: PatientRecord[];
  addPatientRecord: (record: Omit<PatientRecord, 'id' | 'createdAt'>) => void;
  getPatientRecordById: (id: string) => PatientRecord | undefined;
  documentVotes: PatientVoteStore;
  toggleDocumentVote: (patientId: string, documentUrl: string) => void;
  hasVoted: (patientId: string, documentUrl: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRoleState] = useState<UserRole>(null);
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>([]);
  const [documentVotes, setDocumentVotes] = useState<PatientVoteStore>({});

  const setUserRole = useCallback((role: UserRole) => {
    setUserRoleState(role);
  }, []);

  const addPatientRecord = useCallback((record: Omit<PatientRecord, 'id' | 'createdAt'>) => {
    const newRecord: PatientRecord = {
      ...record,
      id: Date.now().toString(), // Simple ID generation
      createdAt: new Date().toISOString(),
    };
    setPatientRecords(prevRecords => [newRecord, ...prevRecords]);
  }, []);

  const getPatientRecordById = useCallback((id: string) => {
    return patientRecords.find(record => record.id === id);
  }, [patientRecords]);

  const toggleDocumentVote = useCallback((patientId: string, documentUrl: string) => {
    setDocumentVotes(prevVotes => {
      const patientSpecificVotes = prevVotes[patientId] || {};
      const newPatientSpecificVotes = { ...patientSpecificVotes };
      if (newPatientSpecificVotes[documentUrl]) {
        delete newPatientSpecificVotes[documentUrl]; // Unvote
      } else {
        newPatientSpecificVotes[documentUrl] = true; // Vote
      }
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
      patientRecords, 
      addPatientRecord, 
      getPatientRecordById,
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
