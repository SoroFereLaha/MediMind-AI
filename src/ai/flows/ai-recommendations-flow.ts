import { ai } from '@/ai/genkit';


import * as z from 'zod';

// 1. Schéma d'entrée : les symptômes du patient
const RecommendationsInputSchema = z.object({
  symptoms: z.string().describe('Symptômes décrits par le patient.'),
});

// 2. Schéma de sortie : une liste d'articles recommandés
const RecommendedDocumentSchema = z.object({
  title: z.string(),
  document_id: z.number(),
  score: z.number().optional(),
  view_url: z.string().optional(),
});

const RecommendationsOutputSchema = z.object({
  articles: z.array(RecommendedDocumentSchema).describe('Liste des articles médicaux recommandés.'),
});

// Types pour l'exportation
export type RecommendationsInput = z.infer<typeof RecommendationsInputSchema>;
export type RecommendationsOutput = z.infer<typeof RecommendationsOutputSchema>;

// 3. Définition du Flow
export const getRecommendationsForPatient = ai.defineFlow(
  {
    name: 'getRecommendationsForPatient',
    inputSchema: RecommendationsInputSchema,
    outputSchema: RecommendationsOutputSchema,
  },
  async (input) => {
    // Étape 1: Utiliser l'IA pour générer une requête de recherche concise à partir des symptômes
    const searchQueryPrompt = `Extrait les 2-3 termes de recherche médicale les plus importants des symptômes suivants. Réponds uniquement avec les termes, séparés par des espaces. Symptômes : "${input.symptoms}"`;
    
    const searchQueryResponse = await ai.generate({
      prompt: searchQueryPrompt,
      output: { format: 'text' },
    });
    const searchQuery = typeof searchQueryResponse === 'string'
      ? searchQueryResponse
      : (searchQueryResponse as any).text ?? (searchQueryResponse as any).text?.();

    console.log(`Generated search query: ${searchQuery}`);

    // Étape 2: Interroger l'API de recherche de documents locale
    try {
      const apiResponse = await fetch('http://localhost:5000/search/rank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: searchQuery,
          limit: 3, // On recommande 3 articles
          include_download_info: true
        }),
      });

      if (!apiResponse.ok) {
        const errorBody = await apiResponse.text();
        console.error('API Error:', errorBody);
        throw new Error(`L'API de recherche a retourné une erreur: ${apiResponse.statusText}`);
      }

      const searchResults = await apiResponse.json();

      // Étape 3: Formater la réponse pour correspondre au schéma de sortie
      return {
        articles: searchResults.results || [],
      };

    } catch (error) {
      console.error('Failed to fetch from document API:', error);
      // En cas d'erreur avec l'API, retourner une liste vide pour ne pas bloquer l'utilisateur
      return { articles: [] };
    }
  }
);
