
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

const RelevantDocumentInputSchema = z.object({
  patientContext: PatientContextSchema,
});
export type RelevantDocumentInput = z.infer<typeof RelevantDocumentInputSchema>;

const DocumentSchema = z.object({
  title: z.string().describe("Titre du document pertinent."),
  url: z.string().describe("URL menant au document (peut être un placeholder pour la simulation)."),
  summary: z.string().optional().describe("Bref résumé du contenu du document ou pourquoi il est pertinent."),
  source: z.string().optional().describe("Source du document (ex: PubMed, Journal Médical Spécifique).")
});
export type Document = z.infer<typeof DocumentSchema>;

const RelevantDocumentOutputSchema = z.object({
  documents: z.array(DocumentSchema).describe("Liste de documents jugés pertinents."),
  reasoning: z.string().optional().describe("Brève explication de la stratégie de recherche ou des types de documents ciblés.")
});
export type RelevantDocumentOutput = z.infer<typeof RelevantDocumentOutputSchema>;

export async function getRelevantDocuments(
  input: RelevantDocumentInput
): Promise<RelevantDocumentOutput> {
  return relevantDocumentsFlow(input);
}

// Outil pour rechercher des documents médicaux.
// REMPLACEZ LA LOGIQUE DE SIMULATION CI-DESSOUS PAR VOTRE PROPRE LOGIQUE D'ACCÈS AUX DONNÉES.
const searchExternalDocumentsTool = ai.defineTool(
  {
    name: 'searchExternalDocuments',
    description: 'Recherche des documents médicaux pertinents (articles, études, directives) basée sur le contexte patient. Doit être connecté à une véritable source de données pour des résultats réels.',
    inputSchema: PatientContextSchema,
    outputSchema: z.array(DocumentSchema),
  },
  async (context) => {
    console.log("searchExternalDocumentsTool: Invocation avec le contexte:", context);

    // =====================================================================================
    // SECTION À MODIFIER POUR INTÉGRER VOTRE BASE DE DONNÉES DE DOCUMENTS
    // =====================================================================================
    // La logique ci-dessous est une SIMULATION.
    // Pour connecter votre propre base de données de documents :
    // 1. Déterminez comment accéder à vos documents (API, connexion directe à une base SQL/NoSQL,
    //    interrogation d'une base de données vectorielle, lecture de fichiers si très petite échelle, etc.).
    // 2. Implémentez ici la logique pour :
    //    a. Vous connecter à votre source de données.
    //    b. Exécuter une requête ou une recherche basée sur les informations du `context`
    //       (context.disease, context.age, context.sex, context.currentNotes).
    //       Par exemple, rechercher des articles où `disease` est un mot-clé, ou filtrer
    //       par pertinence pour l'âge ou le sexe du patient.
    //    c. Transformer les résultats de votre recherche en un tableau d'objets conformes
    //       au `DocumentSchema` (title, url, summary, source).
    // 3. Supprimez ou commentez la logique de simulation ci-dessous.

    /*
    // EXEMPLE THÉORIQUE d'appel à une API de recherche fictive :
    // try {
    //   const queryParams = new URLSearchParams({
    //     disease: context.disease,
    //     age: context.age.toString(),
    //     sex: context.sex,
    //     keywords: context.currentNotes || '',
    //   });
    //   const response = await fetch(`https://votre-api-recherche-documents.com/search?${queryParams}`);
    //   if (!response.ok) {
    //     console.error("Erreur API de recherche de documents:", response.statusText);
    //     return []; // Ou gérer l'erreur autrement
    //   }
    //   const apiResults = await response.json(); // Supposons que l'API retourne un tableau de documents
    //
    //   // Mapper les résultats de l'API à DocumentSchema
    //   const realDocuments = apiResults.map((doc: any) => ({
    //     title: doc.documentTitle,
    //     url: doc.documentUrl,
    //     summary: doc.shortSummary,
    //     source: doc.sourceName,
    //   }));
    //   console.log(`Trouvé ${realDocuments.length} documents réels.`);
    //   return realDocuments.slice(0, 5); // Limiter pour la démo
    //
    // } catch (error) {
    //   console.error("Erreur lors de l'appel à l'API de recherche de documents:", error);
    //   return []; // Ou gérer l'erreur
    // }
    */
    
    // LOGIQUE DE SIMULATION ACTUELLE (à remplacer par votre code d'accès aux données)
    console.log("Utilisation de la logique de SIMULATION pour searchExternalDocumentsTool.");
    await new Promise(resolve => setTimeout(resolve, 500)); // Simuler latence

    const simulatedDocs: Document[] = [];
    if (context.disease.toLowerCase().includes("diabète")) {
      simulatedDocs.push(
        { title: "Directives de Prise en Charge du Diabète de Type 2 - 2024 (Simulé)", url: "https://example.com/sim/diabetes-guidelines-2024", summary: "Recommandations cliniques pour le traitement du diabète.", source: "Association Médicale du Diabète (Simulé)" },
        { title: "Impact de l'alimentation sur le contrôle glycémique (Simulé)", url: "https://example.com/sim/diabetes-diet-study", summary: "Étude récente sur les régimes alimentaires et le diabète.", source: "Journal of Clinical Nutrition (Simulé)" }
      );
    }
    if (context.disease.toLowerCase().includes("hypertension")) {
      simulatedDocs.push(
        { title: "Nouvelles approches pour l'hypertension artérielle (Simulé)", url: "https://example.com/sim/hypertension-therapies", summary: "Revue des traitements innovants pour l'hypertension.", source: "Cardiology Today (Simulé)" }
      );
    }
    if (context.age < 18) {
       simulatedDocs.push(
        { title: `Considérations pédiatriques pour ${context.disease} (Simulé)`, url: `https://example.com/sim/pediatric-${context.disease.toLowerCase().replace(' ','-')}`, summary: `Spécificités de la prise en charge de ${context.disease} chez l'enfant.`, source: "Pediatric Health Journal (Simulé)" }
      );
    }
     if (simulatedDocs.length === 0 && context.disease) {
        simulatedDocs.push(
            { title: `Recherche générale sur ${context.disease} (Simulé)`, url: `https://example.com/sim/general-${context.disease.toLowerCase().replace(' ','-')}`, summary: `Informations générales et articles de recherche sur ${context.disease}.`, source: "General Medical Archives (Simulé)"}
        );
    } else if (simulatedDocs.length === 0) {
        simulatedDocs.push(
            { title: "Document d'information générale (Simulé)", url: "https://example.com/sim/general-info", summary: "Informations générales pertinentes pour le contexte.", source: "Medical Library (Simulé)"}
        );
    }
    // Fin de la logique de simulation

    return simulatedDocs.slice(0, 3); // Limiter le nombre de documents retournés
  }
);


const prompt = ai.definePrompt({
  name: 'relevantDocumentsPrompt',
  input: { schema: RelevantDocumentInputSchema },
  output: { schema: RelevantDocumentOutputSchema },
  tools: [searchExternalDocumentsTool],
  system: `Vous êtes un assistant IA spécialisé dans la recherche documentaire médicale.
Votre rôle est d'identifier des documents (articles de recherche, directives cliniques, études de cas)
qui seraient les plus pertinents pour un médecin traitant un patient avec le contexte fourni.
Utilisez l'outil 'searchExternalDocuments' pour trouver des documents.
Ensuite, formulez une liste de ces documents et fournissez un bref raisonnement sur la pertinence globale ou la stratégie de recherche.
Ne suggérez que des documents qui semblent directement utiles pour la prise de décision clinique ou la compréhension approfondie du cas.
Si l'outil ne retourne aucun document, indiquez-le clairement dans le champ 'documents' (un tableau vide) et adaptez le 'reasoning'.`,
  prompt: `
Contexte Patient:
- Maladie/Condition: {{{patientContext.disease}}}
- Sexe: {{{patientContext.sex}}}
- Âge: {{{patientContext.age}}} ans
{{#if patientContext.currentNotes}}- Notes récentes: {{{patientContext.currentNotes}}}{{/if}}

Veuillez identifier les documents pertinents en utilisant l'outil disponible.
Structurez votre réponse pour inclure les documents trouvés et un raisonnement.
`,
});

const relevantDocumentsFlow = ai.defineFlow(
  {
    name: 'relevantDocumentsFlow',
    inputSchema: RelevantDocumentInputSchema,
    outputSchema: RelevantDocumentOutputSchema,
  },
  async (input) => {
    
    // L'IA est censée appeler le tool `searchExternalDocumentsTool` grâce aux instructions du `system` prompt.
    // La sortie de l'IA (le champ `output` ci-dessous) devrait contenir la liste des documents
    // que le tool a retournés (si l'IA a correctement utilisé le tool et formaté sa réponse).
    const {output} = await prompt(input);

    if (!output) {
      // Fallback au cas où le prompt ne retournerait rien ou si l'IA n'a pas pu structurer la réponse.
      return {
        documents: [],
        reasoning: "Impossible de générer une réponse ou de trouver des documents avec les informations fournies, ou l'IA n'a pas pu formater la sortie correctement.",
      };
    }
    
    // Si vous constatez que l'IA ne remplit pas toujours le champ `documents`
    // même après avoir appelé le tool, vous pourriez avoir besoin d'inspecter
    // la trace d'exécution du flow dans le Genkit Developer UI pour voir
    // ce que le tool a retourné et ce que l'IA a généré.
    // Dans des cas complexes, on pourrait extraire les résultats du tool de la trace,
    // mais idéalement, le prompt est conçu pour que l'IA remplisse correctement le schéma de sortie.

    return output; 
  }
);

