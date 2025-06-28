'use server';

import { ai } from '@/ai/genkit';
import * as z from 'zod';
import { createHash } from 'crypto';

// Configuration de Genkit
// Schéma d'entrée pour le flow
const FindDoctorBySymptomsInputSchema = z.object({
  symptoms: z.string().describe('Les symptômes décrits par le patient.'),
  age: z.number().optional().describe("L'âge du patient."),
  sex: z.string().optional().describe('Le sexe du patient (Homme, Femme).'),
  latitude: z.number().optional().describe('Latitude pour la géolocalisation.'),
  longitude: z.number().optional().describe('Longitude pour la géolocalisation.'),
});

// Schéma pour un médecin individuel
const DoctorSchema = z.object({
  name: z.string().describe('Nom complet du médecin.'),
  specialty: z.string().describe('Spécialité du médecin (ex: Cardiologue, Pédiatre).'),
  address: z.string().describe('Adresse complète du cabinet du médecin.'),
  reasoning: z.string().describe("Brève explication de la raison pour laquelle ce médecin est recommandé."),
});

// Schéma de sortie pour le flow
const FindDoctorBySymptomsOutputSchema = z.object({
  recommendedDoctors: z.array(DoctorSchema).describe('Liste des médecins recommandés.'),
  symptomAnalysis: z.string().describe("Analyse des symptômes et explication des spécialités recommandées."),
});

// Exporter les types pour une utilisation externe
export type FindDoctorBySymptomsInput = z.infer<typeof FindDoctorBySymptomsInputSchema>;
export type FindDoctorBySymptomsOutput = z.infer<typeof FindDoctorBySymptomsOutputSchema>;

// Cache simple en mémoire pour les résultats
const cache = new Map<string, FindDoctorBySymptomsOutput>();

export const findDoctorBySymptoms = ai.defineFlow(
  {
    name: 'findDoctorBySymptoms',
    inputSchema: FindDoctorBySymptomsInputSchema,
    outputSchema: FindDoctorBySymptomsOutputSchema,
  },
  async (input: FindDoctorBySymptomsInput): Promise<FindDoctorBySymptomsOutput> => {
    // Créer une clé de cache basée sur les symptômes et la localisation approximative
    const locationIdentifier = (input.latitude && input.longitude) ? `${input.latitude.toFixed(2)},${input.longitude.toFixed(2)}` : 'unknown';
    const hash = createHash('sha256').update(input.symptoms + locationIdentifier).digest('hex');
    const cacheKey = `find-doctor-${hash}`;

    // Vérifier le cache
    if (cache.has(cacheKey)) {
      console.log('Returning result from cache.');
      return cache.get(cacheKey)!;
    }

    console.log('No cache hit, calling AI model.');

    // Construire le prompt pour l'IA
    const { symptoms, age, sex, latitude, longitude } = input;
    
    let locationPromptPart = "La localisation du patient n'est pas connue.";
    if (latitude && longitude) {
      locationPromptPart = `Le patient se trouve aux coordonnées suivantes : latitude ${latitude}, longitude ${longitude}. Priorise les médecins qui sont réellement proches de ces coordonnées.`;
    }

    const prompt = `
      Un patient décrit les symptômes suivants : "${symptoms}".
      Informations complémentaires : ${age ? `Âge: ${age}.` : ''} ${sex ? `Sexe: ${sex}.` : ''}
      ${locationPromptPart}

      Tâche :
      1. Analyse brièvement les symptômes et identifie les spécialités médicales les plus pertinentes.
      2. Recommande 3 médecins (noms et adresses fictifs mais crédibles) correspondant à ces spécialités. Pour chaque médecin, fournis une brève justification.
      3. Assure-toi que les médecins recommandés sont géographiquement pertinents si la localisation est fournie.

      Tu es un assistant médical IA. Ton rôle est d'analyser les symptômes d'un patient et de recommander des médecins spécialistes pertinents à proximité.
    `;

    // Appeler le modèle d'IA avec la nouvelle API Genkit
    const response = await ai.generate({
      prompt,
      output: { schema: FindDoctorBySymptomsOutputSchema },
    });

    // Gérer la réponse qui peut être soit un objet direct, soit contenir un champ text avec du JSON
    let result: unknown;
    
    if (typeof response === 'string') {
      // Si la réponse est une chaîne, essayer de la parser en JSON
      result = JSON.parse(response);
    } else if (response && typeof response === 'object' && 'text' in response && typeof response.text === 'string') {
      // Si la réponse a un champ text, le parser
      result = JSON.parse(response.text);
    } else if (response && typeof response === 'object' && 'output' in response) {
      // Si la réponse contient directement les données dans une propriété 'output'
      result = (response as any).output;
    } else {
      // Sinon, utiliser directement la réponse
      result = response;
    }

    // Valider le schéma
    const validatedResult = FindDoctorBySymptomsOutputSchema.parse(result);
    
    cache.set(cacheKey, validatedResult);

    return validatedResult;
  }
);