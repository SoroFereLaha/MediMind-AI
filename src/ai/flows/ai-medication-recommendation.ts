
'use server';
/**
 * Medication recommendation flow implementation.
 */

import {ai} from '@/ai/genkit';
import { z } from 'zod';
import { 
  MedicationRecommendationInput, 
  MedicationRecommendationOutput,
  MedicationRecommendationInputSchema,
  MedicationRecommendationOutputSchema,
  RecommendedMedicationSchema
} from '@/ai/types/medication-recommendation-types';

// External medication recommendation service
import { searchDrugsBySymptom } from '@/lib/services/drugApiService';

/**
 * Fetches medication recommendations from OpenFDA based on symptoms and user context.
 */
async function callExternalMedicationModel(
  input: Pick<MedicationRecommendationInput, 'symptoms' | 'age' | 'sex' | 'knownAllergies' | 'currentMedications'>
): Promise<{ recommendations: Array<z.infer<typeof RecommendedMedicationSchema>> }> {
  try {
    const drugs = await searchDrugsBySymptom(input.symptoms, {
      age: input.age,
      sexe: input.sex,
      allergies: input.knownAllergies,
      currentMedications: input.currentMedications
    });

    if (!drugs || drugs.length === 0) {
      console.log('[Medication Debug] No drugs found after OpenFDA search');
      return { recommendations: [] };
    }
    
    console.log('[Medication Debug] Drugs found:', drugs);
    
    return {
      recommendations: drugs.map(drug => ({
        nom: drug.nom || 'Non spécifié',
        reason: drug.indication || 'Indication non précisée.',
        posologie: drug.posologie_adulte || 'Posologie non précisée.',
        effets_secondaires: drug.effets_secondaires || 'Effets secondaires non spécifiés.',
        contre_indications: drug.contre_indications || 'Contre-indications non spécifiées.',
        avertissements: drug.avertissements || 'Avertissements non spécifiés.'
      }))
    };
  } catch (e) {
    console.error('Erreur lors de la récupération des médicaments via OpenFDA:', e);
    return { recommendations: [] };
  }
}

/**
 * Main entry point for medication recommendations.
 */
export async function getMedicationRecommendations(
  input: MedicationRecommendationInput
): Promise<MedicationRecommendationOutput> {
  return medicationRecommendationFlow(input);
}

// Gemini prompt configuration
const prompt = ai.definePrompt({
  name: 'medicationRecommendationWrapperPrompt',
  input: { schema: z.object({
    symptoms: MedicationRecommendationInputSchema.shape.symptoms,
    age: MedicationRecommendationInputSchema.shape.age,
    knownAllergies: MedicationRecommendationInputSchema.shape.knownAllergies,
    currentMedications: MedicationRecommendationInputSchema.shape.currentMedications,
    modelRecommendations: z.array(RecommendedMedicationSchema),
  })},
  output: { schema: MedicationRecommendationOutputSchema },
  prompt: `
  User provided the following information:
  Symptoms: {{{symptoms}}}
  {{#if age}}Age: {{{age}}} years{{/if}}
  {{#if knownAllergies}}Known allergies: {{{knownAllergies}}}{{/if}}
  {{#if currentMedications}}Current medications: {{{currentMedications}}}{{/if}}

  Les informations médicamenteuses proviennent de la base de données OpenFDA et sont basées sur les étiquettes officielles et les informations cliniques :
  {{#if modelRecommendations.length}}
  {{#each modelRecommendations}}
  - Nom: {{nom}}
    Indication: {{reason}}
    Posologie: {{posologie}}
    Effets secondaires: {{effets_secondaires}}
    Contre-indications: {{contre_indications}}
    Avertissements: {{avertissements}}
  {{/each}}
  {{else}}
  Aucune information médicamenteuse spécifique n'a été trouvée pour ces symptômes dans la base de données OpenFDA.
  {{/if}}

  Votre tâche est de présenter ces informations à l'utilisateur.
  1. Présentez les informations médicamenteuses de OpenFDA dans le champ "suggestedMedications".
  2. Remplissez le champ "processedSymptoms" avec les symptômes originaux de l'utilisateur.
  3. Si aucune information n'est trouvée, indiquez-le clairement dans "suggestedMedications".
  `,
});

// Main medication recommendation flow
const medicationRecommendationFlow = ai.defineFlow(
  {
    name: 'medicationRecommendationFlow',
    inputSchema: MedicationRecommendationInputSchema,
    outputSchema: MedicationRecommendationOutputSchema,
  },
  async (input) => {
    // Step 1: Call external medication recommendation model
    const modelOutput = await callExternalMedicationModel({
      symptoms: input.symptoms,
      age: input.age,
      knownAllergies: input.knownAllergies,
      currentMedications: input.currentMedications,
    });

    // Step 2: Use Gemini prompt to wrap response, add warnings, etc.
    const {output} = await prompt({
      symptoms: input.symptoms,
      age: input.age,
      knownAllergies: input.knownAllergies,
      currentMedications: input.currentMedications,
      modelRecommendations: modelOutput.recommendations,
    });

    if (!output) {
      // Fallback if prompt fails to generate response
      return {
        suggestedMedications: [],
        processedSymptoms: input.symptoms,
        importantWarning: 'Avertissement : consultez toujours un professionnel de santé avant de prendre un médicament.',
      };

    }
    return output;
  }
); 