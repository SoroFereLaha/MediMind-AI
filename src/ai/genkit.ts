import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Configuration de l'IA avec la clé API du fichier .env.local
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});

// Vérification de la configuration
if (!process.env.GOOGLE_API_KEY) {
  console.warn('Avertissement : GOOGLE_API_KEY n\'est pas définie dans les variables d\'environnement');
}
