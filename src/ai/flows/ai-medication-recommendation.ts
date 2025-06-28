
'use server';
/**
 * @fileOverview Flow pour la recommandation de médicaments basée sur les symptômes.
 *
 * - getMedicationRecommendations - Fonction principale pour obtenir des recommandations.
 * - MedicationRecommendationInput - Type d'entrée.
 * - MedicationRecommendationOutput - Type de sortie.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MedicationRecommendationInputSchema = z.object({
  symptoms: z.string().describe('Les symptômes décrits par l"utilisateur.'),
  age: z.number().optional().describe('L"âge de l"utilisateur (optionnel).'),
  knownAllergies: z.string().optional().describe('Allergies connues de l"utilisateur (optionnel, ex: "pénicilline, aspirine").'),
  currentMedications: z.string().optional().describe('Médicaments actuellement pris par l"utilisateur (optionnel, ex: "Lisinopril 10mg, Metformine 500mg").'),
});
export type MedicationRecommendationInput = z.infer<
  typeof MedicationRecommendationInputSchema
>;

const RecommendedMedicationSchema = z.object({
  name: z.string().describe('Nom du médicament suggéré.'),
  reason: z.string().describe('Raison pour laquelle ce médicament est suggéré pour les symptômes donnés.'),
  // IMPORTANT: Dosage et instructions spécifiques NE DOIVENT PAS être fournis par l'IA ici.
  // Uniquement des informations générales si absolument nécessaire et vérifiées.
  // La priorité est de référer à un professionnel.
});

const MedicationRecommendationOutputSchema = z.object({
  suggestedMedications: z.array(RecommendedMedicationSchema).describe('Liste des médicaments suggérés.'),
  importantWarning: z.string().describe('Un avertissement crucial sur la nature des recommandations et la nécessité de consulter un professionnel de santé.'),
  processedSymptoms: z.string().describe('Les symptômes tels qu"interprétés ou traités pour la recommandation.')
});
export type MedicationRecommendationOutput = z.infer<
  typeof MedicationRecommendationOutputSchema
>;

/**
 * Fonction simulée pour appeler votre modèle de recommandation de médicaments externe.
 * REMPLACEZ CECI PAR UN APPEL RÉEL À L'API DE VOTRE MODÈLE.
 */
async function callExternalMedicationModel(
  input: Pick<MedicationRecommendationInput, 'symptoms' | 'age' | 'knownAllergies' | 'currentMedications'>
): Promise<{ recommendations: Array<{ name: string; reason: string }> }> {
  console.log('Appel simulé au modèle externe avec les symptômes :', input.symptoms);
  // Logique de simulation :
  // Ceci est un exemple. Votre modèle réel aura sa propre logique.
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simule une latence réseau

  if (input.symptoms.toLowerCase().includes('tête') && input.symptoms.toLowerCase().includes('fièvre')) {
    return {
      recommendations: [
        { name: 'Paracétamol', reason: 'Suggéré pour le soulagement de la douleur légère à modérée et de la fièvre.' },
        { name: 'Ibuprofène', reason: 'Suggéré pour ses propriétés anti-inflammatoires, analgésiques et antipyrétiques.' },
      ],
    };
  } else if (input.symptoms.toLowerCase().includes('gorge')) {
     return {
      recommendations: [
        { name: 'Pastilles pour la gorge', reason: 'Peuvent aider à apaiser une irritation légère de la gorge.' },
      ],
    };
  }
  return { recommendations: [] };
}


export async function getMedicationRecommendations(
  input: MedicationRecommendationInput
): Promise<MedicationRecommendationOutput> {
  return medicationRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'medicationRecommendationWrapperPrompt',
  input: { schema: z.object({
    symptoms: MedicationRecommendationInputSchema.shape.symptoms,
    age: MedicationRecommendationInputSchema.shape.age,
    knownAllergies: MedicationRecommendationInputSchema.shape.knownAllergies,
    currentMedications: MedicationRecommendationInputSchema.shape.currentMedications,
    modelRecommendations: z.array(z.object({name: z.string(), reason: z.string()})),
  })},
  output: { schema: MedicationRecommendationOutputSchema },
  prompt: `
  Un utilisateur a fourni les informations suivantes :
  Symptômes : {{{symptoms}}}
  {{#if age}}Âge : {{{age}}} ans{{/if}}
  {{#if knownAllergies}}Allergies connues : {{{knownAllergies}}}{{/if}}
  {{#if currentMedications}}Médicaments actuels : {{{currentMedications}}}{{/if}}

  Un modèle algorithmique a fourni les suggestions de médicaments suivantes basées sur les symptômes :
  {{#if modelRecommendations.length}}
  {{#each modelRecommendations}}
  - Nom : {{name}}
    Raison : {{reason}}
  {{/each}}
  {{else}}
  Le modèle n'a pas fourni de suggestions spécifiques pour ces symptômes.
  {{/if}}

  Votre tâche est de présenter ces informations à l'utilisateur.
  1. Reformulez les suggestions du modèle (s'il y en a) dans le champ "suggestedMedications". Ne modifiez pas les noms des médicaments.
  2. Fournissez TOUJOURS un avertissement TRÈS CLAIR et SANS AMBIGUÏTÉ dans le champ "importantWarning". Cet avertissement doit indiquer que :
     - Ces suggestions proviennent d'un modèle algorithmique et ne constituent PAS un avis médical.
     - L'utilisateur DOIT IMPÉRATIVEMENT consulter un médecin, un pharmacien ou un autre professionnel de santé qualifié avant de prendre toute décision concernant des médicaments ou sa santé.
     - L'automédication peut être dangereuse.
     - Les informations sur les allergies et les médicaments actuels, si fournies, ont été prises en compte par le modèle, mais une vérification par un professionnel est essentielle. S'ils n'ont pas été fournis, mentionnez que des interactions sont possibles.
  3. Remplissez le champ "processedSymptoms" avec les symptômes originaux de l'utilisateur.
  4. Si aucune recommandation n'est faite par le modèle, indiquez-le clairement dans "suggestedMedications" (par exemple, un tableau vide) et maintenez l'avertissement.
  NE PAS suggérer de posologie. NE PAS donner d'instructions d'utilisation. NE PAS agir comme un médecin. Votre rôle est de relayer l'information du modèle et d'émettre des avertissements.
  `,
});

const medicationRecommendationFlow = ai.defineFlow(
  {
    name: 'medicationRecommendationFlow',
    inputSchema: MedicationRecommendationInputSchema,
    outputSchema: MedicationRecommendationOutputSchema,
  },
  async (input) => {
    // Étape 1 : Appeler le modèle de recommandation de médicaments externe (simulé ici)
    const modelOutput = await callExternalMedicationModel({
      symptoms: input.symptoms,
      age: input.age,
      knownAllergies: input.knownAllergies,
      currentMedications: input.currentMedications,
    });

    // Étape 2: Utiliser un prompt Gemini pour envelopper la réponse, ajouter des avertissements, etc.
    const {output} = await prompt({
      symptoms: input.symptoms,
      age: input.age,
      knownAllergies: input.knownAllergies,
      currentMedications: input.currentMedications,
      modelRecommendations: modelOutput.recommendations,
    });

    if (!output) {
      // Fallback au cas où le prompt ne retournerait rien (ce qui ne devrait pas arriver avec un bon prompt)
      return {
        suggestedMedications: [],
        importantWarning: 'ERREUR : Impossible de générer une réponse. AVERTISSEMENT : Ces informations ne remplacent pas un avis médical. Consultez toujours un professionnel de santé qualifié pour toute question médicale ou avant de prendre une décision concernant des médicaments.',
        processedSymptoms: input.symptoms,
      };
    }
    return output;
  }
);
    