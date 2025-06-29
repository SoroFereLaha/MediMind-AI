/**
 * Types for the drug API service
 */

export interface ExtractedSymptom {
  original: string;
  translated: string;
}

export interface OpenFDAResponse {
  results: Array<{
    id?: string;
    set_id?: string;
    name?: string;
    indication?: string;
    purpose?: string;
    [key: string]: any;
  }>;
  meta?: Record<string, any>;
}

export interface ProcessedDrug {
  id?: string;
  set_id?: string;
  rawData: any;
  nom: string;
  indication: string;
  posologie_adulte: string;
  effets_secondaires: string;
  contre_indications: string;
  avertissements: string;
}
