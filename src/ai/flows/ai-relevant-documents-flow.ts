
'use server';
/**
 * @fileOverview Flow pour recommander des documents pertinents basé sur le contexte patient.
 *
 * - getRelevantDocuments - Fonction principale pour obtenir des recommandations de documents.
 * - RelevantDocumentInput - Type d'entrée.
 * - RelevantDocumentOutput - Type de sortie.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PatientContextSchema = z.object({
  disease: z.string().describe("La maladie ou condition principale du patient."),
  sex: z.string().describe("Le sexe du patient (ex: Masculin, Féminin, Autre)."),
  age: z.number().describe("L'âge du patient en années."),
  currentNotes: z.string().optional().describe("Notes additionnelles ou observations récentes sur le patient."),
});

export const RelevantDocumentInputSchema = z.object({
  patientContext: PatientContextSchema,
});
export type RelevantDocumentInput = z.infer<typeof RelevantDocumentInputSchema>;

const DocumentSchema = z.object({
  title: z.string().describe("Titre du document pertinent."),
  url: z.string().url().describe("URL menant au document (peut être un placeholder pour la simulation)."),
  summary: z.string().optional().describe("Bref résumé du contenu du document ou pourquoi il est pertinent."),
  source: z.string().optional().describe("Source du document (ex: PubMed, Journal Médical Spécifique).")
});
export type Document = z.infer<typeof DocumentSchema>;

export const RelevantDocumentOutputSchema = z.object({
  documents: z.array(DocumentSchema).describe("Liste de documents jugés pertinents."),
  reasoning: z.string().optional().describe("Brève explication de la stratégie de recherche ou des types de documents ciblés.")
});
export type RelevantDocumentOutput = z.infer<typeof RelevantDocumentOutputSchema>;

export async function getRelevantDocuments(
  input: RelevantDocumentInput
): Promise<RelevantDocumentOutput> {
  return relevantDocumentsFlow(input);
}

// Simuler une base de connaissances ou un appel à une API de recherche documentaire
const searchExternalDocumentsTool = ai.defineTool(
  {
    name: 'searchExternalDocuments',
    description: 'Recherche des documents médicaux pertinents (articles, études, directives) basée sur le contexte patient. Actuellement simulé.',
    inputSchema: PatientContextSchema,
    outputSchema: z.array(DocumentSchema),
  },
  async (context) => {
    console.log("searchExternalDocumentsTool: Recherche simulée pour contexte:", context);
    // SIMULATION: En réalité, vous appelleriez ici une API (PubMed, Google Scholar, etc.)
    // ou interrogeriez une base de données vectorielle.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simuler latence

    const simulatedDocs: Document[] = [];
    if (context.disease.toLowerCase().includes("diabète")) {
      simulatedDocs.push(
        { title: "Directives de Prise en Charge du Diabète de Type 2 - 2024", url: "https://example.com/diabetes-guidelines-2024", summary: "Recommandations cliniques pour le traitement du diabète.", source: "Association Médicale du Diabète" },
        { title: "Impact de l'alimentation sur le contrôle glycémique chez les patients diabétiques", url: "https://example.com/diabetes-diet-study", summary: "Étude récente sur les régimes alimentaires et le diabète.", source: "Journal of Clinical Nutrition" }
      );
    }
    if (context.disease.toLowerCase().includes("hypertension")) {
      simulatedDocs.push(
        { title: "Nouvelles approches thérapeutiques pour l'hypertension artérielle", url: "https://example.com/hypertension-therapies", summary: "Revue des traitements innovants pour l'hypertension.", source: "Cardiology Today" }
      );
    }
    if (context.age < 18) {
       simulatedDocs.push(
        { title: `Considérations pédiatriques pour ${context.disease}`, url: `https://example.com/pediatric-${context.disease.toLowerCase().replace(' ','-')}`, summary: `Spécificités de la prise en charge de ${context.disease} chez l'enfant.`, source: "Pediatric Health Journal" }
      );
    }
     if (simulatedDocs.length === 0) {
        simulatedDocs.push(
            { title: `Recherche générale sur ${context.disease}`, url: `https://example.com/general-${context.disease.toLowerCase().replace(' ','-')}`, summary: `Informations générales et articles de recherche sur ${context.disease}.`, source: "General Medical Archives"}
        );
    }

    return simulatedDocs.slice(0, 3); // Limiter le nombre de documents simulés
  }
);


const prompt = ai.definePrompt({
  name: 'relevantDocumentsPrompt',
  input: { schema: RelevantDocumentInputSchema },
  output: { schema: RelevantDocumentOutputSchema },
  system: `Vous êtes un assistant IA spécialisé dans la recherche documentaire médicale.
Votre rôle est d'identifier des documents (articles de recherche, directives cliniques, études de cas)
qui seraient les plus pertinents pour un médecin traitant un patient avec le contexte fourni.
Utilisez l'outil 'searchExternalDocuments' pour trouver des documents.
Ensuite, formulez une liste de ces documents et fournissez un bref raisonnement sur la pertinence globale.
Ne suggérez que des documents qui semblent directement utiles pour la prise de décision clinique ou la compréhension approfondie du cas.
Si l'outil ne retourne aucun document, indiquez-le.`,
  prompt: `
Contexte Patient:
- Maladie/Condition: {{{patientContext.disease}}}
- Sexe: {{{patientContext.sex}}}
- Âge: {{{patientContext.age}}} ans
{{#if patientContext.currentNotes}}- Notes récentes: {{{patientContext.currentNotes}}}{{/if}}

Veuillez identifier les documents pertinents en utilisant l'outil disponible.
`,
});

const relevantDocumentsFlow = ai.defineFlow(
  {
    name: 'relevantDocumentsFlow',
    inputSchema: RelevantDocumentInputSchema,
    outputSchema: RelevantDocumentOutputSchema,
    tools: [searchExternalDocumentsTool],
  },
  async (input) => {
    
    // Pourrait aussi appeler directement le tool ici et ensuite passer les résultats au prompt pour synthèse
    // Mais pour cet exemple, on laisse le LLM décider d'appeler le tool basé sur le system prompt
    const {output} = await prompt(input);

    if (!output) {
      // Fallback au cas où le prompt ne retournerait rien
      return {
        documents: [],
        reasoning: "Impossible de générer une réponse ou de trouver des documents avec les informations fournies.",
      };
    }
    
    // Si l'IA n'a pas utilisé l'outil (ce qui est peu probable avec ce prompt),
    // ou si on veut s'assurer que l'outil est appelé.
    // Cette version est simplifiée, le LLM devrait appeler le tool via le `system` prompt.
    // Si le LLM ne remplit pas bien le champ `documents` mais utilise le tool,
    // il faudrait extraire les résultats du tool de la trace, ce qui est plus complexe ici.

    return output; 
  }
);
