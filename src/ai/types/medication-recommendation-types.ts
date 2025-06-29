/**
 * Types and schemas for medication recommendation system
 */

import { z } from 'zod';

// Input schema for medication recommendations
export const MedicationRecommendationInputSchema = z.object({
  symptoms: z.string(),
  age: z.number().optional(),
  sex: z.string().optional(),
  knownAllergies: z.string().optional(),
  currentMedications: z.string().optional(),
});
export type MedicationRecommendationInput = z.infer<typeof MedicationRecommendationInputSchema>;

// Schema for individual medication recommendations
export const RecommendedMedicationSchema = z.object({
  nom: z.string(),
  reason: z.string(),
  posologie: z.string(),
  effets_secondaires: z.string(),
  contre_indications: z.string(),
  avertissements: z.string()
});

// Output schema for medication recommendations
export const MedicationRecommendationOutputSchema = z.object({
  suggestedMedications: z.array(RecommendedMedicationSchema),
  importantWarning: z.string(),
  processedSymptoms: z.string()
});
export type MedicationRecommendationOutput = z.infer<typeof MedicationRecommendationOutputSchema>;
